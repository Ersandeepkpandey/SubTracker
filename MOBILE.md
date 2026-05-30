# SubTrack Mobile App Plan

## Decision
Build a Flutter Android app that connects to the **existing Express API**.
No new backend needed — reuse everything already built.

## Architecture
```
Flutter App (Dart)  ←→  Express API (Node.js)  ←→  PostgreSQL
     Mobile               194.164.151.64:4000
```

## Auth Flow (Mobile)
Flutter cannot use NextAuth. A separate mobile auth endpoint is needed:

1. Flutter triggers Google Sign-In natively (`google_sign_in` package)
2. Gets Google ID token from the sign-in result
3. Sends token to `POST /api/auth/mobile` (new endpoint to build)
4. API verifies the Google token with Google's servers
5. Finds or creates the user in DB
6. Returns a signed JWT (standard JWS, not JWE like NextAuth)
7. Flutter stores JWT in `flutter_secure_storage`
8. Every API request sends `Authorization: Bearer <jwt>`

### Backend changes needed
- Add `POST /api/auth/mobile` endpoint in Express
- Add `mobileAuthMiddleware` that verifies signed JWT (separate from web JWE middleware)
- Or update existing `authMiddleware` to handle both formats

## Flutter App Screens
| Screen | API endpoint used |
|--------|------------------|
| Login | `POST /api/auth/mobile` |
| Dashboard | `GET /api/insights/summary` |
| Subscriptions list | `GET /api/subscriptions` |
| Add subscription | `POST /api/subscriptions` |
| Subscription detail | `GET /api/subscriptions/:id` |
| Edit subscription | `PUT /api/subscriptions/:id` |
| Delete subscription | `DELETE /api/subscriptions/:id` |
| Insights / charts | `GET /api/insights/categories` |
| Settings / profile | `GET /api/user/me` |

## Flutter Packages
```yaml
dependencies:
  google_sign_in: ^6.x        # Google OAuth
  dio: ^5.x                   # HTTP client
  flutter_secure_storage: ^9.x # Store JWT safely
  riverpod: ^2.x              # State management
  fl_chart: ^0.x              # Charts for insights
  cached_network_image: ^3.x  # Subscription logos
  intl: ^0.x                  # Date/currency formatting
```

## Prerequisites Before Starting
1. Flutter SDK installed → https://flutter.dev/install
2. Android Studio installed ✓ (already have)
3. Google OAuth Client ID for Android (separate from web client ID)
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create credential → OAuth 2.0 Client ID → Android
   - Package name: `com.subtrack.app`
   - SHA-1 fingerprint: run `keytool -list -v -keystore ~/.android/debug.keystore`

## Build Steps (when ready)
```bash
# 1. Create Flutter project
flutter create subtrack_mobile --org com.subtrack

# 2. Add dependencies to pubspec.yaml (see packages above)

# 3. Configure Google Sign-In
#    - Add google-services.json to android/app/
#    - Download from Google Cloud Console → your Android OAuth client

# 4. Run on emulator or device
flutter run

# 5. Build release APK
flutter build apk --release
```

## API Base URL
```dart
const String apiBaseUrl = 'http://194.164.151.64.nip.io/api';
// Update to https://yourdomain.com/api once domain + SSL is set up
```

## Notes
- Complete the website fully before starting mobile
- When domain + SSL is ready: update apiBaseUrl and enable Gmail scope
- Capacitor setup already exists in apps/web (fallback WebView option)
- The existing Capacitor android folder can be deleted once Flutter app is ready
