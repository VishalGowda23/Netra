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
    
    import pydantic.v1.main
    orig_new = pydantic.v1.main.ModelMetaclass.__new__
    def patched_new(mcs, name, bases, namespace, **kwargs):
        try:
            return orig_new(mcs, name, bases, namespace, **kwargs)
        except TypeError as e:
            if "differs from the new default" in str(e):
                namespace_clean = {k: v for k, v in namespace.items() if k.startswith("__")}
                if '__annotations__' in namespace_clean:
                    namespace_clean['__annotations__'] = {}
                return orig_new(mcs, name, bases, namespace_clean, **kwargs)
            raise
    pydantic.v1.main.ModelMetaclass.__new__ = staticmethod(patched_new)
except ImportError:
    pass

import importlib
try:
    from crewai import Agent, Task, Crew
    print("CrewAI loaded successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
