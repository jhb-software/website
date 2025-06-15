import { GenericTranslationsObject } from './index.js'

export const de: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'jhb-dashboard': {
    // General
    website: 'Website',

    // Deployment Info Feature
    deploymentInfoTitle: 'Website Veröffentlichungen',
    deploymentInfoDescription:
      'Da die Website aus Performancegründen statisch ist, muss bei Inhaltsänderungen im CMS eine neue Veröffentlichung erstellt werden, bei dem die Website mit den aktuell im CMS veröffentlichten Inhalten neu erstellt wird. Der Erstellungsprozess dauert in der Regel 1-2 Minuten.',
    deploymentInfoActiveDeployment: 'Aktive Veröffentlichung',
    deploymentInfoLatestDeployment: 'Neueste Veröffentlichung',
    deploymentInfoTriggerRebuild: 'Neue Veröffentlichung erstellen',
    deploymentInfoInspectDeployment: 'Veröffentlichung inspizieren',
    deploymentInfoDeploymentTriggeredSuccessfully: 'Neue Veröffentlichung erfolgreich erstellt',
    deploymentInfoDeploymentTriggeredFailed: 'Neue Veröffentlichung konnte nicht erstellt werden',
    deploymentInfoDeploymentCompletedSuccessfully:
      'Neue Veröffentlichung erfolgreich abgeschlossen',

    // Vercel Deployment Status
    vercelDeploymentStatusBuilding: 'Wird gebaut',
    vercelDeploymentStatusReady: 'Bereit',
    vercelDeploymentStatusError: 'Fehler',
    vercelDeploymentStatusQueued: 'In Warteschlange',
    vercelDeploymentStatusInitializing: 'Wird initialisiert',
    vercelDeploymentStatusCanceled: 'Abgebrochen',
    vercelDeploymentStatusDeleted: 'Gelöscht',
    vercelDeploymentStatusFailed: 'Fehlgeschlagen',
    vercelDeploymentStatusUnknown: 'Unbekannter Status',
  },
}
