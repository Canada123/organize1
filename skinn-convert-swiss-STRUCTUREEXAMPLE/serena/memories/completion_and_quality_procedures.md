# Task Completion and Quality Procedures

## When a Task is Completed

### Immediate Actions Required
1. **Run Quality Checks**
   ```bash
   npm run check        # ESLint + TypeScript + test coverage
   npm run test:e2e     # End-to-end tests for critical flows
   ```

2. **Update Context Files**
   - Update `context/todo.md` - mark tasks as completed
   - Update `context/CLAUDE-planning.md` - reflect progress and next phases
   - Update `context/event-stream.md` - log completion event
   - Update `context/conventions.md` - if new patterns emerged

3. **Documentation Maintenance**
   - **ALWAYS** invoke documentation-maintainer after code changes
   - Update relevant API documentation
   - Archive obsolete documents to docs/archive/YYYY-MM-DD/
   - Update doc-ref.md index

4. **Code Quality Verification**
   - All components must be ≤50 lines
   - TypeScript strict mode compliance
   - WCAG 2.1 AA accessibility compliance
   - Performance metrics: LCP <2.5s, CLS <0.1, FID <100ms

## Git Workflow for Completion
```bash
# Stage changes
git add .

# Commit with semantic message
git commit -m "feat: implement atomic eligibility components

- Refactor 851-line monolith into 12 atomic components  
- Add centralized state management with Context API
- Implement Swiss compliance features (VAT, cantons)
- All components now ≤50 lines following project conventions

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to feature branch
git push origin feature/branch-name
```

## Testing Requirements Before Completion
- **Unit Tests**: 80% coverage for services, 70% for utilities
- **Integration Tests**: Critical user flows tested
- **Accessibility Tests**: WCAG AA compliance verified
- **Performance Tests**: Core Web Vitals within targets
- **Multi-language Tests**: All 4 languages functional

## Documentation Update Checklist
- [ ] README.md updated with new component counts
- [ ] Architecture documentation reflects new patterns
- [ ] API documentation updated if interfaces changed
- [ ] Swiss compliance features documented for regulatory purposes
- [ ] Component interaction diagrams updated
- [ ] Form implementation guides updated

## File Organization Compliance
- [ ] All new files in correct locations per file-organization-framework.md
- [ ] No files added to root directory
- [ ] Images moved to /public/assets/images/
- [ ] Archive old documentation to archive/YYYY-MM-DD/
- [ ] Update doc-ref.md with new file locations

## Multi-Panel Expert Review (for Major Features)
For significant features like the eligibility questionnaire refactoring:
- **Security Review**: Vulnerability assessment complete
- **Accessibility Review**: WCAG compliance verified  
- **Performance Review**: Load times and metrics validated
- **Swiss Compliance Review**: Healthcare regulations verified
- **Architecture Review**: Code quality and maintainability assessed

## Success Metrics Validation
- [ ] Performance targets met (985ms load time achieved)
- [ ] Component count updated (now 105+ components)
- [ ] All components follow ≤50 line convention
- [ ] Swiss features properly implemented (VAT, cantons, age validation)
- [ ] Multi-language functionality preserved across all 4 languages