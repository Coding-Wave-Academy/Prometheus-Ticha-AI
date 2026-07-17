import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: {
        title: "Ready to improve 1% every day?",
        getStarted: "Get Started",
        hasAccount: "Already have an account?",
        login: "Log in",
      },
      language: {
        title: "What language do you prefer?",
        footer: "You can change this in settings anytime",
        continue: "Continue",
      },
      goal: {
        title: "What is your primary goal?",
        subtitle: "Let's get 1% better every single day.",
        continue: "Continue",
        gce: {
          title: "Ace my GCE exams",
          description: "Master your subjects with AI",
          badge: "TOP 5% OF STUDENTS CHOSE THIS",
        },
        habit: {
          title: "Build a daily study habit",
          description: "Consistency is the key to success",
          badge: "#1 HABIT OF TOP PERFORMERS",
        },
        rank: {
          title: "Boost my school rank",
          description: "Outperform your peers daily",
          badge: "HIGHLY COMPETITIVE",
        },
        curiosity: {
          title: "Daily curiosity",
          description: "Learn something new every day",
          badge: "POPULAR CHOICE",
        },
      },
      login: {
        title: "Welcome back, scholar!",
        subtitle: "Ready to pick up where you left off?",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        forgotPassword: "Forgot?",
        submit: "Log In →",
        noAccount: "New here?",
        createAccount: "Create an account",
        or: "OR",
      },
      register: {
        title: "Create Account",
        subtitle: "Now, let's save your progress.",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        submit: "Sign Up →",
        hasAccount: "Already have an account?",
        login: "Log in",
        or: "OR",
      },
    },
  },
  fr: {
    translation: {
      welcome: {
        title: "Prêt à vous améliorer de 1% chaque jour?",
        getStarted: "Commencer",
        hasAccount: "Vous avez déjà un compte?",
        login: "Se connecter",
      },
      language: {
        title: "Quelle langue préférez-vous?",
        footer: "Vous pouvez changer cela dans les paramètres à tout moment",
        continue: "Continuer",
      },
      goal: {
        title: "Quel est votre objectif principal?",
        subtitle: "Devenons 1% meilleur chaque jour.",
        continue: "Continuer",
        gce: {
          title: "Réussir mes examens GCE",
          description: "Maîtrisez vos matières avec l'IA",
          badge: "TOP 5% DES ÉTUDIANTS ONT CHOISI CELA",
        },
        habit: {
          title: "Créer une habitude d'étude",
          description: "La régularité est la clé du succès",
          badge: "HABITUDE #1 DES MEILLEURS ÉLÈVES",
        },
        rank: {
          title: "Améliorer mon classement",
          description: "Surpassez vos pairs chaque jour",
          badge: "TRÈS COMPÉTITIF",
        },
        curiosity: {
          title: "Curiosité quotidienne",
          description: "Apprenez quelque chose de nouveau chaque jour",
          badge: "CHOIX POPULAIRE",
        },
      },
      login: {
        title: "Bon retour, scholar!",
        subtitle: "Prêt à reprendre là où vous vous êtes arrêté?",
        emailLabel: "Adresse e-mail",
        passwordLabel: "Mot de passe",
        forgotPassword: "Oublié?",
        submit: "Se connecter →",
        noAccount: "Nouveau ici?",
        createAccount: "Créer un compte",
        or: "OU",
      },
      register: {
        title: "Créer un compte",
        subtitle: "Maintenant, sauvegardons votre progression.",
        nameLabel: "Nom complet",
        emailLabel: "Adresse e-mail",
        passwordLabel: "Mot de passe",
        confirmPasswordLabel: "Confirmer le mot de passe",
        submit: "S'inscrire →",
        hasAccount: "Vous avez déjà un compte?",
        login: "Se connecter",
        or: "OU",
      },
    },
  },
};

// Initialize i18next
if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: localStorage.getItem("ticha_lang") || "en", // read language preference or default to en
      fallbackLng: "en",
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
}

export default i18n;
export { resources };
