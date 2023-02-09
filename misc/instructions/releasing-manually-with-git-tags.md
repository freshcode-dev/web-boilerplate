# Tags and releases
Use this instruction in case, part of your app needs to be versioned properly (instead of being delivered continuously)

## .gitlab-ci.yml updates
#### Define, what tags you want to react to 
If you want to run job every time some tag is created, it's enough to check pipeline has corresponding variable

```yaml
deploy-main:
  extends: .web-deployment-job
  environment:
    name: main
  rules:
    - if: $CI_COMMIT_TAG #this one
```

If you want to react to some specific tags (which is important when dealing with monorepos), specify the expected Regex patterns

```yaml
variables:
# Any string starting from web/0.0.0
  WEB_TAG_REGEX: /^web\/([0-9]+[\.]?)+/
# web/0.0.0 but not web/0.0.0-env nor web/0.0.0-env-0
  WEB_MAIN_BRANCH_TAG_REGEX: /^web\/([0-9]+[\.]?)+$/
# web/0.0.0-staging or web/0.0.0-staging-0
  WEB_STAGING_BRANCH_TAG_REGEX: /^web\/([0-9]+[\.]?)+(-(staging){1})(-[\d])?$/
```

#### Define automated job to create releases every when a tag is created
This part is quite optional, as you may not need to create releases in your publishing strategy. But anyway, it might be useful in some cases

```yaml
create-release-main:
  stage: deployment
  interruptible: true
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  dependencies:
    - deploy-main
  script:
    - echo 'Release creation...'
  release:
    name: 'Web Release $CI_COMMIT_TAG'
    description: 'Created automatically as a result of manual tag creation'
    tag_name: $CI_COMMIT_TAG
    ref: $CI_COMMIT_TAG
  rules:
    - if: $CI_COMMIT_TAG =~ $WEB_MAIN_BRANCH_TAG_REGEX
```

[More about what GitLab releases are](https://docs.gitlab.com/ee/user/project/releases)
