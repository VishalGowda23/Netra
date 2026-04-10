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
    
    import pydantic.v1.utils
    orig_lenient_issubclass = pydantic.v1.utils.lenient_issubclass
    def patched_lenient_issubclass(cls, class_or_tuple):
        if cls is typing.Any:
            return True
        try:
            return orig_lenient_issubclass(cls, class_or_tuple)
        except Exception:
            return True
    pydantic.v1.utils.lenient_issubclass = patched_lenient_issubclass
    
except ImportError:
    pass


import importlib
try:
    import langchain.agents.openai_functions_agent.agent_token_buffer_memory
    print("AgentTokenBufferMemory loaded successfully!")
    from crewai import Agent, Task, Crew
    print("CrewAI loaded successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
