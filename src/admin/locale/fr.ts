import { Locale, LocaleTranslations } from 'adminjs';

const translations: Record<string, LocaleTranslations> = {
  fr: {
    actions: {
      new: 'Nouveau',
      edit: 'Éditer',
      show: 'Détails',
      delete: 'Supprimer',
      bulkDelete: 'Tout supprimer',
      list: 'Liste',
    },
    buttons: {
      addNewItem: 'Ajouter un nouvel élément',
      applyChanges: 'Valider',
      confirmRemovalMany_plural: 'Confirmer la suppression de {{count}} éléments ?',
      confirmRemovalMany: 'Confirmer la suppression de {{count}} élément',
      createFirstRecord: 'Créer un élément',
      filter: 'Filtrer',
      login: 'Connexion',
      logout: 'Déconnexion',
      resetFilter: 'Réinitialiser',
      save: 'Sauvegarder',
      seeTheDocumentation: 'Voir: <1>la documentation</1>',
    },
    labels: {
      navigation: 'Navigation',
      pages: 'Pages',
      selectedRecords: 'Sélectionnés ({{selected}})',
      filters: 'Filtres',
      adminVersion: 'Admin: {{version}}',
      appVersion: 'App: {{version}}',
      loginWelcome: 'voucher rest api | Admin',
      dashboard: 'Tableau de bord',
    },
    messages: {},
    properties: {
      length: 'Length',
      from: 'Entre',
      to: 'Et',
    },
    resources: {},
  },
};

const locale: Locale = {
  language: 'fr',
  translations,
};

export default locale;
