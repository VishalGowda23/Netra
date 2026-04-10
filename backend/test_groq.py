import typing

try:
    import pydantic.v1.fields
    import pydantic.v1.errors
    orig_set_default_and_type = pydantic.v1.fields.ModelField._set_default_and_type
    def patched_set_default_and_type(self):
        try:
            orig_set_default_and_type(self)
        except Exception:
            self.type_ = typing.Any
            self.required = False
            self.allow_none = True
    pydantic.v1.fields.ModelField._set_default_and_type = patched_set_default_and_type

    import pydantic.v1.class_validators
    orig_validator = pydantic.v1.class_validators.validator
    def patched_validator(*args, **kwargs):
        kwargs["check_fields"] = False
        return orig_validator(*args, **kwargs)
    pydantic.v1.class_validators.validator = patched_validator
    
    import pydantic.v1
    pydantic.v1.validator = patched_validator
except ImportError:
    pass

import importlib
try:
    from langchain_groq import ChatGroq
    from langchain_core.messages import HumanMessage
    
    llm = ChatGroq(temperature=0.0, groq_api_key="none", model_name="llama3-70b-8192")
    print("ChatGroq loaded successfully!")
    print(llm)
except Exception as e:
    import traceback
    traceback.print_exc()
