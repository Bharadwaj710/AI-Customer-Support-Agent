def detect_intent(
    query: str
):

    query = query.lower()

    ticket_keywords = [
        "create ticket",
        "raise ticket",
        "support ticket",
        "open ticket"
    ]

    for keyword in ticket_keywords:

        if keyword in query:

            return "ticket"

    return "rag"