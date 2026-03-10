import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }: any) {

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
            <Text style={styles.headerEmoji}>💖</Text>
            <Text style={styles.headerTitle}>Créons ton espace bien-être</Text>
            <Text style={styles.headerSubtitle}>
              Quelques infos pour démarrer ton aventure.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.section}>
            <Text style={styles.label}>Nom Complet</Text>
            <TextInput
              placeholder="Ex : Fouad Lamrini"
              placeholderTextColor="#D4A8A8"
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
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
              placeholder="••••••••"
              placeholderTextColor="#D4A8A8"
              secureTextEntry
              style={styles.input}
            />
          </View>


          {/* CTA */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Créer mon compte</Text>
          </TouchableOpacity>

          {/* Bottom text */}
          <View style={styles.bottomBlock}>
            <View style={styles.inlineText}>
              <Text style={styles.simpleText}>Tu as déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
                <Text style={styles.linkHighlight}>Connexion</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              En continuant, tu acceptes d’écouter ton corps et de rester bienveillante avec toi-même 🌸
            </Text>
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
  inlineText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  footerText: {
    fontFamily: 'Georgia',
    fontSize: 11,
    color: '#C4A0A0',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontStyle: 'italic',
    marginTop: 4,
  },
  errorText: {
    marginTop: 6,
    fontFamily: 'Georgia',
    fontSize: 12,
    color: '#C04040',
  },
});

