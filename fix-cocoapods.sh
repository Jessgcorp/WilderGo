#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}WilderGo CocoaPods Fix Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print status
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Step 1: Check and install Homebrew if needed
print_status "Step 1a: Checking Homebrew installation..."

if ! command -v brew &> /dev/null; then
    print_status "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [ $? -eq 0 ]; then
        print_success "Homebrew installed successfully"
    else
        print_error "Failed to install Homebrew"
        exit 1
    fi
fi

# Ensure Homebrew is available in this shell
if [ -x "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

print_status "Step 1a: Homebrew check complete"

# Step 1b: Check and install CocoaPods
print_status "Step 1b: Checking CocoaPods installation..."

if ! command -v pod &> /dev/null; then
    print_status "CocoaPods not found. Installing via Homebrew..."
    brew install cocoapods
    if [ $? -eq 0 ]; then
        print_success "CocoaPods installed via Homebrew"
    else
        print_error "Failed to install CocoaPods via Homebrew"
        exit 1
    fi
else
    print_success "CocoaPods is already installed"
fi

# Ensure pod is available from Homebrew path on Apple Silicon
if [ -x "/opt/homebrew/bin/pod" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
fi

# Verify pod command works
if ! command -v pod &> /dev/null; then
    print_error "pod command still not available after installation"
    exit 1
fi

print_success "CocoaPods verification passed"

# Step 2: Navigate to ios folder and run pod install
print_status "Step 2: Running pod install in ios folder..."

cd ios || {
    print_error "Failed to navigate to ios folder"
    exit 1
}

# Check if we're on Apple Silicon
if [[ $(uname -m) == 'arm64' ]]; then
    print_status "Apple Silicon detected. Running pod install with x86_64 architecture..."
    POD_CMD=(arch -x86_64 pod install --repo-update --clean-install)
else
    print_status "Intel Mac detected. Running pod install normally..."
    POD_CMD=(pod install --repo-update --clean-install)
fi

"${POD_CMD[@]}"
if [ $? -ne 0 ]; then
    print_error "Initial pod install failed, retrying with pod cache cleanup..."
    rm -rf Pods Podfile.lock
    if [[ $(uname -m) == 'arm64' ]]; then
        POD_CMD=(arch -x86_64 pod install --repo-update --clean-install)
    else
        POD_CMD=(pod install --repo-update --clean-install)
    fi
    "${POD_CMD[@]}"
fi

if [ $? -eq 0 ]; then
    print_success "pod install completed successfully"
else
    print_error "pod install failed after retry"
    cd ..
    exit 1
fi

cd .. || {
    print_error "Failed to navigate back to root"
    exit 1
}

# Step 3: Clean cache (run in background)
print_status "Step 3: Starting React Native cache reset in the background..."

npx react-native start --reset-cache > /tmp/rn-cache-reset.log 2>&1 &
RN_PID=$!
print_status "React Native started (PID: $RN_PID). Logs available at /tmp/rn-cache-reset.log"

# Give it a few seconds to initialize
sleep 5

# Step 4: Launch iOS simulator
print_status "Step 4: Launching iOS simulator for iPhone 17 Pro..."

# Check if simulator is already running
if xcrun simctl list | grep -q "iPhone 17 Pro"; then
    print_status "Found iPhone 17 Pro simulator"
    # Get the device ID
    DEVICE_ID=$(xcrun simctl list devices | grep "iPhone 17 Pro" | grep -oE '\(([A-F0-9\-]+)\)' | head -1 | sed 's/[()]//g')
    
    if [ -z "$DEVICE_ID" ]; then
        print_error "Could not find iPhone 17 Pro device ID"
    else
        print_status "Booting iPhone 17 Pro (ID: $DEVICE_ID)..."
        xcrun simctl boot "$DEVICE_ID" 2>/dev/null || true
        open -a Simulator
        print_success "iOS Simulator launched"
    fi
else
    print_error "iPhone 17 Pro simulator not found"
    print_status "Available simulators:"
    xcrun simctl list devices | grep "iPhone"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "\nYour environment is now ready for development."
echo -e "React Native is running in the background (PID: $RN_PID)"
echo -e "To stop it, run: kill $RN_PID"
echo -e "\nRun: ${YELLOW}npx expo start${NC} to launch your app in the simulator\n"
