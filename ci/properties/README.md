# Introduction

Simple properties override mechanism for feature environments

# Setting branch-specific build property overrides

You can create a file in the `ci\properties` directory called BRANCH_NAME.properties, where BRANCH_NAME must exactly match the name of your branch after the last "/" (case sensitive). For example feature/TICKET-000-my-feature-branch would require a file at `ci/properties/TICKET-000-my-feature-branch.properties`.

If found, this file will be read in by the pipeline and override and default properties or properties set earlier in the pipeline file.

**The BRANCH_NAME.properties file must be in Groovy KEY="value" format, comments must use // notation rather than #.**

An example file can be found in `ci/properties/feature-branch-example.properties`. If the pipeline output shows that your file was found, but you can see that the properties were not loaded, please double-check the format of your file.

The most common use for properties overrides might be for requesting a feature environment to be built before the branch is a PR, or requesting that the container is wiped out and rebuilt every time the pipeline runs (i.e. on every commit).

## Example file

The example file contains the following:
```
// add properties in the format of the example
env.VS_BRANCH_SPECIFIC_PROPERTY = "vs-branch-specific-value"

// to force the build of a feature environment for a branch, without making the branch a PR, uncomment the line below
//env.VS_BUILD_FEATURE_ENVIRONMENT = "TRUE"

// to force the deletion of any existing container, and the creation of a fresh container, uncomment the line below
//env.VS_CONTAINER_PRESERVE = "FALSE" 
```