import random
import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TICKETS_FILE = BASE_DIR / "data" / "tickets.json"

def _load_tickets():
    if not os.path.exists(TICKETS_FILE):
        return []
    try:
        with open(TICKETS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []

def _save_tickets(tickets):
    with open(TICKETS_FILE, "w", encoding="utf-8") as f:
        json.dump(tickets, f, indent=4)


def create_ticket(
    name: str,
    email: str,
    issue: str
):

    ticket_number = random.randint(
        1000,
        9999
    )

    ticket = {
        "ticketId": f"TKT-{ticket_number}",
        "status": "created",
        "name": name,
        "email": email,
        "issue": issue
    }

    tickets = _load_tickets()
    tickets.append(ticket)
    _save_tickets(tickets)

    return ticket

def get_all_tickets():
    return _load_tickets()