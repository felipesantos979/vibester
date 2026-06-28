import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/providers/feed/publication_list_provider.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/providers/user/user_provider.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/screens/events/event_detail_screen.dart';
import 'package:mobile/screens/events/event_list_screen.dart';
import 'package:mobile/screens/events/favorites_events_screen.dart';
import 'package:mobile/screens/feed/feed_screen.dart';
import 'package:mobile/screens/feed/new_publication_screen.dart';
import 'package:mobile/screens/home/home_screen.dart';
import 'package:mobile/screens/home/initial_screen.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:mobile/screens/places/favorite_places_screen.dart';
import 'package:mobile/screens/places/hot_places_screen.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/screens/places/place_reviews_screen.dart';
import 'package:mobile/screens/register/email_confirm_screen.dart';
import 'package:mobile/screens/register/login_screen.dart';
import 'package:mobile/screens/register/recover_password_screen.dart';
import 'package:mobile/screens/register/register_screen.dart';
import 'package:mobile/screens/register/reset_password_screen.dart';
import 'package:mobile/screens/search/search_screen.dart';
import 'package:mobile/screens/settings/account_management_settings_screen.dart';
import 'package:mobile/screens/settings/personal_information_settings_screen.dart';
import 'package:mobile/screens/settings/settings_screen.dart';
import 'package:mobile/screens/user/profile_editing_screen.dart';
import 'package:mobile/screens/user/user_interests_screen.dart';
import 'package:mobile/screens/user/user_profile_screen.dart';
import 'package:provider/provider.dart';

PageRouteBuilder _slideRoute(Widget page, RouteSettings settings) {
  return PageRouteBuilder(
    settings: settings,
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) => SlideTransition(
      position: Tween<Offset>(
        begin: const Offset(1, 0),
        end: Offset.zero,
      ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut)),
      child: child,
    ),
  );
}

PageRouteBuilder _fadeRoute(Widget page, RouteSettings settings) {
  return PageRouteBuilder(
    settings: settings,
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) =>
        FadeTransition(opacity: animation, child: child),
  );
}

PageRouteBuilder _scaleRoute(Widget page, RouteSettings settings) {
  return PageRouteBuilder(
    settings: settings,
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) => ScaleTransition(
      scale: Tween<double>(
        begin: 0.9,
        end: 1.0,
      ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut)),
      child: FadeTransition(opacity: animation, child: child),
    ),
  );
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('pt_BR', null);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlaceListProvider()),
        ChangeNotifierProvider(create: (_) => EventsListProvider()),
        ChangeNotifierProvider(create: (_) => PublicationListProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          textTheme: GoogleFonts.interTextTheme(),
          fontFamily: GoogleFonts.inter().fontFamily,
        ),
        initialRoute: AppRoutes.initialScreen,
        onGenerateRoute: (settings) {
          switch (settings.name) {
            // EVENTS
            case AppRoutes.eventList:
              return _slideRoute(const EventListScreen(), settings);
            case AppRoutes.favoritesEvents:
              return _slideRoute(const FavoritesEventsScreen(), settings);
            case AppRoutes.eventDetail:
              final event = settings.arguments as EventModel;
              return _scaleRoute(
                EventDetailScreen(eventModel: event),
                settings,
              );

            // PLACES
            case AppRoutes.favoritesPlaces:
              return _slideRoute(const FavoritePlacesScreen(), settings);
            case AppRoutes.hotPlaces:
              return _slideRoute(const HotPlacesScreen(), settings);
            case AppRoutes.placeDetail:
              final placeId = settings.arguments as String;
              return _scaleRoute(PlaceDetailScreen(placeId: placeId), settings);
            case AppRoutes.placeReviews:
              final place = settings.arguments as PlaceModel;
              return _scaleRoute(PlaceReviewsScreen(place: place), settings);

            // HOME
            case AppRoutes.home:
              return _fadeRoute(const HomeScreen(), settings);
            case AppRoutes.initialScreen:
              return _fadeRoute(const InitialScreen(), settings);

            // REGISTER
            case AppRoutes.emailConfirm:
              return _fadeRoute(const EmailConfirmScreen(), settings);
            case AppRoutes.login:
              return _fadeRoute(const LoginScreen(), settings);
            case AppRoutes.recoverPassword:
              return _fadeRoute(const RecoverPasswordScreen(), settings);
            case AppRoutes.register:
              return _fadeRoute(const RegisterScreen(), settings);
            case AppRoutes.resetPassword:
              return _fadeRoute(const ResetPasswordScreen(), settings);

            // SEARCH
            case AppRoutes.search:
              return _slideRoute(const SearchScreen(), settings);

            // SETTINGS
            case AppRoutes.accountManagementSettings:
              return _slideRoute(
                const AccountManagementSettingsScreen(),
                settings,
              );
            case AppRoutes.settings:
              return _slideRoute(const SettingsScreen(), settings);
            case AppRoutes.personalInformationSettings:
              return _slideRoute(
                const PersonalInformationSettingsScreen(),
                settings,
              );

            // USER
            case AppRoutes.profile:
              return _slideRoute(const UserProfileScreen(), settings);
            case AppRoutes.profileEditing:
              return _slideRoute(const ProfileEditingScreen(), settings);
            case AppRoutes.userInterests:
              return _slideRoute(const UserInterestsScreen(), settings);

            // FEED
            case AppRoutes.feed:
              return _slideRoute(const FeedScreen(), settings);
            case AppRoutes.newPublication:
              return _scaleRoute(const NewPublicationScreen(), settings);

            default:
              return null;
          }
        },
      ),
    );
  }
}
