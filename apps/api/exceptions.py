from rest_framework.views import exception_handler


def verinews_exception_handler(exc, context):
    """
    Custom exception handler for VeriNews API.

    Converts all DRF errors into a consistent format.
    """

    response = exception_handler(exc, context)

    if response is None:
        return response

    original_data = response.data

    if isinstance(original_data, dict) and "detail" not in original_data:
        response.data = {
            "error": True,
            "detail": "Validation failed. See 'fields' for details.",
            "fields": original_data,
        }

    else:
        detail = (
            original_data.get("detail")
            if isinstance(original_data, dict)
            else str(original_data)
        )

        response.data = {
            "error": True,
            "detail": str(detail),
        }

    return response