import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';

export default function LoginScreen({ navigation }: any) {
  const { login, isAuthLoading, authError, clearAuthError } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    clearAuthError();
    try {
      await login({
        email: email.trim(),
        password,
      });
    } catch {
      // L'erreur est déjà gérée dans le contexte.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🌸</Text>
            <Text style={styles.headerTitle}>Bienvenue sur HealthSphere</Text>
            <Text style={styles.headerSubtitle}>
              Suis ton bien-être jour après jour.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.section}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="toi@example.com"
              placeholderTextColor="#D4A8A8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#D4A8A8"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

          {/* Main action */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            disabled={isAuthLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {isAuthLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          {/* Secondary actions */}
          <View style={styles.bottomBlock}>

            <View style={styles.inlineText}>
              <Text style={styles.simpleText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
                <Text style={styles.linkHighlight}>Inscription</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0F2',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginHorizontal: -20,
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2C2C',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#C48B8B',
    marginTop: 6,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  label: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5E5E',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0D0D3',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#3D2C2C',
    fontFamily: 'Georgia',
  },
  primaryButton: {
    marginTop: 30,
    backgroundColor: '#E8A4A0',
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#E8A4A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryButtonText: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomBlock: {
    marginTop: 26,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#C48B8B',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0D0D3',
  },
  dividerLabel: {
    marginHorizontal: 10,
    fontFamily: 'Georgia',
    fontSize: 12,
    color: '#C4A0A0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inlineText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  simpleText: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#8B5E5E',
  },
  linkHighlight: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#C04040',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorText: {
    marginTop: 14,
    color: '#C04040',
    fontFamily: 'Georgia',
    fontSize: 12,
    textAlign: 'center',
  },
});

