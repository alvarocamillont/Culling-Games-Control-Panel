## ADDED Requirements

### Requirement: Real-time Stats Display
The system SHALL display a statistics bar showing:
- Active Sorcerers: The total number of registered sorcerers.
- Points Distributed: The sum of points of all registered sorcerers.
- Deceased Rate: The percentage of deceased sorcerers (Deceased / Total * 100) rounded to the nearest integer.

#### Scenario: Stats Update on State Change
- **WHEN** a new player is registered, updated, or eradicated
- **THEN** the system SHALL instantly recalculate and display the updated stats.

### Requirement: Grid Search and Filtering
The system SHALL provide filters to query the player grid dynamically:
- Search Input: Filters cards whose Name or Cursed Technique contains the query (case-insensitive).
- Colony Filter: Select dropdown to show all colonies or filter by a specific colony.
- Status Filter Tabs: "All", "Alive", and "Deceased" tabs to filter by current status.
- Empty State: Displays a fallback UI when no players match the filters.

#### Scenario: Filtering by Status
- **WHEN** the user clicks on the "Deceased" tab
- **THEN** the grid SHALL only show players whose status is "Deceased".

### Requirement: Player Card Visuals and Eradication
Each player card SHALL display their Name, Colony, Cursed Technique, Points, and Status.
- Alive players SHALL have a green left border and a green status indicator.
- Deceased players SHALL have a red left border, a red status indicator, and 65% opacity.
- Clicking the "Eradicate" (trash) icon SHALL remove the player.

#### Scenario: Eradicate Player Action
- **WHEN** the user clicks the "Eradicate" button on a player card
- **THEN** the system SHALL remove the player from the database and refresh the dashboard.
