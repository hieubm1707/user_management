# Semantic Commit Messages

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

## Example

```
/‾‾‾‾‾‾‾‾
😼  <  Meow! Please use semantic commit messages
    \________

feat: add hat wobble

<type>(scope): <short summary>
    │    │            │
    │    │            └─> Summary in present tense. Not capitalized. No period at the end. 
    │    │
    │    └─> Scope: common|compiler|authentication|core|
    │                                                                                          
    └─> Type: chore, docs, feat, fix, refactor, style, or test.


```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html


## Quick setup — if you’ve done this kind of thing before

### or create a new repository on the command line

```
echo "# test" >> README.md
git init
git add README.md
git commit -m "feat: first commit"
git branch -M main
git remote add origin https://github.com/hieubm1707/user_management.git
git push -u origin main
```


### or push an existing repository from the command line

```
git remote add origin https://github.com/hieubm1707/user_management.git
git branch -M main
git push -u origin main
```



