export enum Status {
  NONE = 'NONE',
  RECEIVED = 'RECEIVED', // Ablauf Schadensmeldung - Status Eingegangen
  PROCESS = 'PROCESS', // Ablauf Schadensmeldung - Status Bearbeitung
  REQUIRED = 'REQUIRED', // Ablauf Schadensmeldung - Status Angaben Erforderlich
  DENIED = 'DENIED', // Ablauf Schadensmeldung - Status Abgelehnt
  CONFIRMED = 'CONFIRMED', // Ablauf Schadensmeldung - Status Bestätigt
  DISBURSED = 'DISBURSED', // Ablauf Schadensmeldung - Status Ausgezahlt
}
