from services.ticket_service import (
    create_ticket
)

result = create_ticket(
    name="John Doe",
    email="john@example.com",
    issue="Unable to access dashboard"
)

print(result)