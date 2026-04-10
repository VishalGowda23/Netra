import sys
try:
    from pydantic.v1 import BaseModel
    import typing
    class ChatResult(BaseModel):
        llm_output: typing.Optional[dict] = None
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
