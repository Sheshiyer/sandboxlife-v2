# SandboxLife Kiro Steering Documentation

## Overview

This directory contains steering documentation for the SandboxLife journaling application, focused on the icon/question system, Supabase integration, and UI component workflows. These documents are intended to stay aligned with the current codebase.

## Document Structure

### 📋 [Icon Management System](./icon-management-system.md)
**Purpose**: Comprehensive guide to the icon and question system architecture
**Use When**: 
- Understanding the current system structure
- Planning new icon additions
- Troubleshooting icon-related issues
- Onboarding new developers

**Key Topics**:
- Data structure and component flow
- Icon asset requirements
- Question writing guidelines
- Technical implementation details
- Supabase integration patterns

### 🗄️ [Database Schema Guide](./database-schema-guide.md)
**Purpose**: Detailed documentation of the database structure and SQL operations
**Use When**:
- Working with database queries
- Planning schema changes
- Debugging data issues
- Setting up development environments

**Key Topics**:
- Table structures and relationships
- Query patterns and optimization
- Row Level Security (RLS) policies
- Indexing strategies
- Data migration procedures

### 🔧 [Component Integration Guide](./component-integration-guide.md)
**Purpose**: React component architecture and integration patterns
**Use When**:
- Modifying UI components
- Understanding data flow
- Implementing new features
- Debugging component issues

**Key Topics**:
- Component hierarchy and props
- State management patterns
- Navigation and workflow
- Error handling
- Performance optimization

### ☁️ [Supabase Configuration Guide](./supabase-configuration-guide.md)
**Purpose**: Backend configuration and API management
**Use When**:
- Setting up Supabase integration
- Managing authentication
- Configuring storage
- Implementing security policies

**Key Topics**:
- Project setup and configuration
- Authentication and RLS
- Storage management
- API functions and queries
- Security best practices

### 🔄 [Icon Update Workflow](./icon-update-workflow.md)
**Purpose**: Step-by-step process for updating icons and questions
**Use When**:
- Adding new icons to the system
- Updating existing questions
- Planning content updates
- Ensuring quality and consistency

**Key Topics**:
- Pre-update checklist
- Asset preparation and upload
- Code implementation steps
- Testing and validation
- Deployment and monitoring

### 🧭 [Set B Preview Implementation](./setb-preview-implementation.md)
**Purpose**: Preview-only Set B icon collection documentation
**Use When**:
- Updating the Set B preview card or collection page
- Adjusting the iconsv2 preview workflow

## Quick Start Guide

### For New Developers
1. Start with [Icon Management System](./icon-management-system.md) to understand the overall architecture
2. Review [Database Schema Guide](./database-schema-guide.md) to understand data structures
3. Study [Component Integration Guide](./component-integration-guide.md) for UI patterns
4. Check [Supabase Configuration Guide](./supabase-configuration-guide.md) for backend setup

### For Icon Updates
1. Follow the [Icon Update Workflow](./icon-update-workflow.md) step-by-step
2. Reference [Icon Management System](./icon-management-system.md) for technical details
3. Use [Database Schema Guide](./database-schema-guide.md) for data validation
4. Check [Supabase Configuration Guide](./supabase-configuration-guide.md) for storage management

### For Troubleshooting
1. Check the troubleshooting sections in each relevant guide
2. Review [Component Integration Guide](./component-integration-guide.md) for UI issues
3. Consult [Database Schema Guide](./database-schema-guide.md) for data problems
4. Reference [Supabase Configuration Guide](./supabase-configuration-guide.md) for backend issues

## Current System Overview

### Architecture Summary
```
Frontend (React/Vite)
├── Icon Selection (IconSelectionWindow.jsx)
├── Journal Entry (JournalEntrySection.jsx)
├── Calendar Overview (CalendarDateHeader.jsx)
├── Data Constants (questions.jsx)
└── Supabase Integration (supabase.jsx)

Backend (Supabase)
├── Authentication (auth.users)
├── Database (user_journal_entries)
├── Storage (new_icons bucket)
└── Security (RLS policies)
```

### Key Data Flow
```
Icon Constants → Icon Selection → Journal Entry → Database Storage → Display
```

### Journal Types
- **Daily Journal**: Quick daily reflections (5 per day limit)
- **Book Journal**: Comprehensive life stories (unlimited)
- **Thought of the Day**: Brief status updates
 - **Set B Preview**: Preview-only iconsv2 collection (no journaling)

## Development Workflow

### Standard Development Process
1. **Planning**: Review requirements and existing documentation
2. **Design**: Plan changes using the steering guides
3. **Implementation**: Follow established patterns and workflows
4. **Testing**: Use testing guidelines from relevant documents
5. **Deployment**: Follow deployment procedures
6. **Monitoring**: Track changes and gather feedback

### Code Quality Standards
- Follow existing patterns documented in the guides
- Maintain consistency with the current spacing scale and design tokens
- Use standardized design tokens (rounded-card, shadow-card, etc.)
- Test thoroughly using provided testing strategies
- Document changes and update steering docs as needed

## Maintenance and Updates

### Regular Maintenance Tasks
- **Icon URL Refresh**: Update expired Supabase storage URLs
- **Performance Monitoring**: Track loading times and user engagement
- **Content Review**: Evaluate question effectiveness and user feedback
- **Security Updates**: Review and update RLS policies as needed

### Documentation Updates
These steering documents should be updated whenever:
- System architecture changes
- New features are added
- Workflows are modified
- Best practices evolve

## Support and Resources

### Internal Resources
- Component source code in `src/components/`
- Database utilities in `src/utils/supabase.jsx`
- Icon constants in `src/constants/questions.jsx`
- Styling configuration in `tailwind.config.js`

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Getting Help
1. Check the relevant steering document first
2. Review the troubleshooting sections
3. Consult the source code and comments
4. Test in a development environment
5. Reach out to team members for complex issues

## Contributing to Documentation

### When to Update Documentation
- After implementing new features
- When fixing bugs that reveal documentation gaps
- After learning better practices or patterns
- When onboarding reveals unclear instructions

### How to Update Documentation
1. Identify the relevant steering document(s)
2. Make changes following the existing structure
3. Test any code examples or procedures
4. Review for clarity and completeness
5. Update this README if new documents are added

---

*This documentation is maintained by the SandboxLife development team and should be kept current with system changes.*
