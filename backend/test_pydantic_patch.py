import sys
import typing

try:
    import pydantic.v1.fields
    import pydantic.v1.errors
    orig_set_default_and_type = pydantic.v1.fields.ModelField._set_default_and_type

    def patched_set_default_and_type(self):
        try:
            orig_set_default_and_type(self)
        except pydantic.v1.errors.ConfigError:
            self.type_ = typing.Any
            self.required = False
            self.allow_none = True

    pydantic.v1.fields.ModelField._set_default_and_type = patched_set_default_and_type
except ImportError:
    pass

try:
    from pydantic.v1 import BaseModel
    class ChatResult(BaseModel):
        llm_output: typing.Optional[dict] = None
    print("Success after patch")
except Exception as e:
    import traceback
    traceback.print_exc()
