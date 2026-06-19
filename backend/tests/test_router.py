from services.router import (
    detect_intent
)

print(
    detect_intent(
        "How do I reset password?"
    )
)

print(
    detect_intent(
        "Create a support ticket"
    )
)