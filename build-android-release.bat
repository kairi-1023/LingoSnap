@echo off
set "ROOT=%~dp0"
set "ANDROID_DIR=%ROOT%android"

echo ==============================================
echo  Android Release Build Script
echo ==============================================

set NODE_ENV=production
set EXPO_PUBLIC_ENV=production

:: Step 1: Regenerate native assets from Expo config (app icon, splash, etc.)
echo.
echo [Step 1] Regenerating native assets from Expo configuration...
echo.
cd /d "%ROOT%"
call npx expo prebuild 2>&1
if %ERRORLEVEL% neq 0 (
    echo [WARNING] expo prebuild encountered an issue, continuing...
)
echo [OK] Native assets regenerated.
echo.

:: Step 2: Verify .env.production has real values (not placeholders)
echo.
echo [Step 2] Verifying .env.production configuration...
echo.
findstr /b "EXPO_PUBLIC_SUPABASE_URL" "%ROOT%.env.production" | findstr "your-prod-supabase-url" >nul
if not errorlevel 1 (
    echo [ERROR] .env.production still contains placeholder URL!
    echo Please update .env.production with your real Supabase URL before building.
    pause
    exit /b 1
)
findstr /b "EXPO_PUBLIC_SUPABASE_ANON_KEY" "%ROOT%.env.production" | findstr "your-prod-anon-key" >nul
if not errorlevel 1 (
    echo [ERROR] .env.production still contains placeholder ANON KEY!
    echo Please update .env.production with your real Supabase anon key before building.
    pause
    exit /b 1
)
echo [OK] .env.production looks valid.
echo.

:: Step 3: Check Environment Variables / Android SDK & Keystore
if "%ANDROID_HOME%"=="" (
    echo [WARNING] ANDROID_HOME environment variable is not set.
    echo Please check your Android SDK path.
)
if "%JAVA_HOME%"=="" (
    echo [WARNING] JAVA_HOME environment variable is not set.
    echo Please check your JDK path.
)

if not exist "%ANDROID_DIR%\app\release.keystore" (
    if not exist "%USERPROFILE%\.android\debug.keystore" (
        echo [NOTICE] No release.keystore found in android/app/
        echo To sign your APK for Play Store release, place release.keystore in android/app/
        echo Or run: keytool -genkey -v -keystore android/app/release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    )
)

if not exist "%ANDROID_DIR%\gradlew.bat" (
    echo [ERROR] Android project folder or gradlew.bat not found.
    echo Path checked: %ANDROID_DIR%
    pause
    exit /b 1
)

echo.
echo Please select the build type:
echo [1] APK (For testing/installing directly on devices)
echo [2] AAB (App Bundle, for Google Play Store upload)
echo [3] Exit
echo.

set /p choice="Enter your choice (1-3): "

set "TASK="
set "OUT_DIR="

if "%choice%"=="1" (
    set "TASK=assembleRelease"
    set "OUT_DIR=%ANDROID_DIR%\app\build\outputs\apk\release"
)
if "%choice%"=="2" (
    set "TASK=bundleRelease"
    set "OUT_DIR=%ANDROID_DIR%\app\build\outputs\bundle\release"
)
if "%choice%"=="3" (
    exit /b 0
)

if "%TASK%"=="" (
    echo Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo [Step 4] Starting Gradle Release Build (%TASK%)...
cd /d "%ANDROID_DIR%"

:: Clean Gradle and CMake caches
call gradlew.bat --stop 2>nul
if exist ".gradle" (
    echo Cleaning project Gradle cache...
    rmdir /s /q ".gradle" 2>nul
)
if exist "app\.cxx" (
    echo Cleaning CMake build cache...
    rmdir /s /q "app\.cxx" 2>nul
)

set NODE_ENV=production
set EXPO_PUBLIC_ENV=production
call gradlew.bat %TASK%

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed with error code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==============================================
echo  Release Build (%TASK%) Completed Successfully!
echo ==============================================
echo Output Directory: %OUT_DIR%
echo.
explorer "%OUT_DIR%"
pause
