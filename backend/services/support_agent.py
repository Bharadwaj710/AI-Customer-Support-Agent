from services.router import detect_intent

from services.rag_service import (
    generate_rag_answer
)

from services.ticket_service import (
    create_ticket
)


def handle_query(
    query: str,
    name: str = None,
    email: str = None
):

    intent = detect_intent(query)

    if intent == "ticket":

     return create_ticket(
        name=name or "Unknown User",
        email=email or "Not Provided",
        issue=query
    )

    result = generate_rag_answer(query)


    return result