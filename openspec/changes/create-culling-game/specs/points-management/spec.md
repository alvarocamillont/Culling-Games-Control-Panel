## ADDED Requirements

### Requirement: Quick Point Adjustments
The system SHALL provide quick action buttons for adjusting points directly on Alive player cards:
- "+1 PTS" button SHALL increase the player's points by 1.
- "-1 PTS" button SHALL decrease the player's points by 1 (clamped to a minimum of 0).
- If the player is Deceased, point adjustment buttons SHALL be replaced with a "LOCKED" indicator, disabling updates.

#### Scenario: Quick Increment of Points
- **WHEN** the user clicks the "+1 PTS" button on Yuta Okkotsu's card (who has 190 points and is Alive)
- **THEN** the system SHALL update Yuta Okkotsu's points to 191 and broadcast a Kogane notification.

#### Scenario: Deceased Player Points Locked
- **WHEN** the user views the card of Reggie Star (who is Deceased)
- **THEN** the point adjustment buttons SHALL be hidden, and a disabled "LOCKED" label SHALL be displayed.

### Requirement: Point Transfer between Sorcerers
The system SHALL provide a "Point Transfer" form under the side-panel tab that allows transferring points from one Alive sender to another Alive receiver:
- Sender Select dropdown: lists all Alive sorcerers.
- Receiver Select dropdown: lists all Alive sorcerers.
- Points input: integer >= 1 (default 1).
- System SHALL validate that the sender and receiver are not the same participant.
- System SHALL validate that the sender has at least the amount of points specified for transfer.
- Kogane Broadcast Feed: log entry is recorded with the transfer details.

#### Scenario: Transfer to Self Prevented
- **WHEN** the user selects "Yuji Itadori" as both the Sender and the Receiver, then clicks "Authorize Transfer"
- **THEN** the system SHALL block the transfer and show an error indicating that a participant cannot transfer points to themselves.

#### Scenario: Transfer with Insufficient Points
- **WHEN** the user attempts to transfer 10 points from Yuji Itadori (who has 1 point) to Megumi Fushiguro
- **THEN** the system SHALL block the transfer and display an error of insufficient points.

#### Scenario: Successful Point Transfer
- **WHEN** the user transfers 40 points from Megumi Fushiguro (who has 40 points) to Yuji Itadori (who has 1 point)
- **THEN** Megumi Fushiguro's points SHALL become 0, Yuji Itadori's points SHALL become 41, and a Kogane log feed entry SHALL record the transaction.

### Requirement: Culling Game Rules Manual
The system SHALL provide a modal dialog listing the rules of the Culling Game:
- Clicking the "View" button in the stats header SHALL open the modal.
- Clicking the close icon or "Acknowledge Rules" button SHALL close the modal.

#### Scenario: View Rules Modal
- **WHEN** the user clicks "View" under the Culling Rules stat
- **THEN** the Rules Modal SHALL open overlaying the page content.
