## ADDED Requirements

### Requirement: Form Fields and Types
The system SHALL present a reactive form for registering new players with the following inputs:
- Name: text input (REQUIRED)
- Starting Colony: select dropdown with colonies: "Tokyo Colony No. 1", "Tokyo Colony No. 2", "Sendai Colony", "Sakurajima Colony", "Kyoto Colony", "Iwate Colony" (REQUIRED)
- Cursed Technique Specification: textarea (OPTIONAL)
- Starting Points: number input between 0 and 1000, defaulting to 0 (REQUIRED)
- Initial Status: select dropdown with options "Alive" (Green pulse/active) and "Deceased" (Red/dead) (REQUIRED)

#### Scenario: Verify Form Elements Presence
- **WHEN** the user navigates to the registration view
- **THEN** the form SHALL contain input fields for Name, Colony, Cursed Technique, Starting Points, and Initial Status.

### Requirement: Form Validation and Submission
The system SHALL prevent submission and display errors when required fields are missing or invalid, and SHALL send a POST request to `/api/players` with the player object when valid.

#### Scenario: Submit Form with Empty Required Fields
- **WHEN** the user attempts to submit the form without filling the Name field
- **THEN** the form SHALL show a validation error for the Name field and prevent the submission.

#### Scenario: Successful Form Submission
- **WHEN** the user enters "Yuta Okkotsu" as Name, selects "Sendai Colony" as Colony, inputs "Copy / Rika Manifestation" as Cursed Technique, sets 190 points, chooses "Alive" status, and submits the form
- **THEN** the system SHALL send a POST request to `/api/players` with the player details, update the local state, and broadcast a Kogane notification.
