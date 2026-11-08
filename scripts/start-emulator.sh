#!/usr/bin/env bash
# Boots the API 34 Google APIs emulator used by the local suite.
set -euo pipefail

ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/android-sdk}}"
export ANDROID_HOME
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

AVD_NAME="${AVD_NAME:-mda_api_34}"
SYSTEM_IMAGE="${SYSTEM_IMAGE:-system-images;android-34;google_apis;x86_64}"

if ! command -v emulator >/dev/null 2>&1 || ! command -v adb >/dev/null 2>&1; then
  echo "Android emulator and platform-tools must be on PATH. Set ANDROID_HOME." >&2
  exit 1
fi

if [[ ! -e /dev/kvm ]]; then
  echo "KVM is not available. The emulator needs /dev/kvm." >&2
  exit 1
fi

if ! emulator -list-avds | grep -qx "$AVD_NAME"; then
  echo "Creating AVD ${AVD_NAME}"
  echo no | avdmanager create avd --name "$AVD_NAME" --package "$SYSTEM_IMAGE" --device pixel_6 --force
fi

AVD_DIR="${HOME}/.android/avd/${AVD_NAME}.avd"
CONFIG="${AVD_DIR}/config.ini"
if [[ -f "$CONFIG" ]]; then
  if grep -q '^hw.ramSize=' "$CONFIG"; then
    sed -i 's/^hw.ramSize=.*/hw.ramSize=2048/' "$CONFIG"
  else
    echo 'hw.ramSize=2048' >> "$CONFIG"
  fi
  grep -q '^hw.keyboard=' "$CONFIG" || echo 'hw.keyboard=yes' >> "$CONFIG"
fi

adb start-server >/dev/null
if adb devices | grep -q 'emulator-'; then
  echo "An emulator is already connected."
  exit 0
fi

mkdir -p logs
nohup emulator \
  -avd "$AVD_NAME" \
  -no-window \
  -no-audio \
  -no-boot-anim \
  -gpu swiftshader_indirect \
  -accel on \
  -memory 2048 \
  >logs/emulator.log 2>&1 &
echo $! >logs/emulator.pid

adb wait-for-device
for _ in $(seq 1 90); do
  boot="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  if [[ "$boot" == "1" ]]; then
    adb shell settings put global window_animation_scale 0 >/dev/null
    adb shell settings put global transition_animation_scale 0 >/dev/null
    adb shell settings put global animator_duration_scale 0 >/dev/null
    # Gesture navigation treats a left-edge swipe as Back and closes the app.
    adb shell cmd overlay enable com.android.internal.systemui.navbar.threebutton >/dev/null || true
    echo "Emulator ${AVD_NAME} is ready."
    exit 0
  fi
  sleep 2
done

echo "Emulator did not finish booting. See logs/emulator.log." >&2
exit 1
