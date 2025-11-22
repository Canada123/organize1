# Visual Architecture Diagrams

Generated: 2025-01-15

## System Overview

```mermaid
graph TB
    subgraph "Frontend Application"
        React[React 18 + TypeScript]
        Router[React Router DOM v6]
        UI[shadcn/ui Components]
        
        React --> Router
        React --> UI
    end
    
    subgraph "State Management"
        Context[Context API]
        Query[TanStack Query]
        Forms[React Hook Form + Zod]
        
        Context --> Lang[Language Context]
        Context --> Theme[Theme Context]
        Context --> Analytics[Analytics Context]
    end
    
    subgraph "External Services"
        GA[Google Analytics]
        GAds[Google Ads]
        HS[HubSpot]
    end
    
    React --> Context
    React --> Query
    React --> Forms
    Analytics --> GA
    Analytics --> GAds
    Analytics --> HS
```

## Component Architecture

```mermaid
graph TD
    App[App.tsx]
    
    App --> Layout[Layout Components]
    App --> Pages[Page Components]
    
    Layout --> Navbar[Navbar.tsx]
    Layout --> Footer[Footer.tsx]
    
    Pages --> Home[Index.tsx]
    Pages --> Solutions[Solutions Pages]
    Pages --> Partners[Partners Pages]
    Pages --> HowItWorks[How It Works Pages]
    Pages --> About[About Pages]
    
    Home --> HeroSection[HeroSection.tsx]
    Home --> ContactForm[ContactForm.tsx]
    Home --> EligibilityChecker[EligibilityChecker.tsx]
    Home --> Testimonials[TestimonialsSection.tsx]
    
    subgraph "Design System"
        UI[UI Components]
        UI --> Button[button.tsx]
        UI --> Card[card.tsx]
        UI --> MedicalCard[medical-card.tsx]
        UI --> Form[Form Controls]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Router
    participant Component
    participant Context
    participant Translation
    participant Analytics
    
    User->>Router: Navigate to /de/loesungen
    Router->>Context: Update language to 'de'
    Router->>Component: Render Solutions page
    Component->>Translation: Request German translations
    Translation-->>Component: Return translated content
    Component->>Analytics: Track page view
    Analytics->>GA: Send event (if consented)
    Component-->>User: Display German content
```

## Language Routing Architecture

```mermaid
graph LR
    subgraph "URL Structure"
        EN[English: /solutions/14-day-holter]
        DE[German: /de/loesungen/14-tage-holter]
        FR[French: /fr/solutions/holter-14-jours]
    end
    
    subgraph "Components"
        Page[Same Page Component]
        Lang[Language Context]
        Trans[Translation Hook]
    end
    
    EN --> Page
    DE --> Page
    FR --> Page
    
    Page --> Lang
    Lang --> Trans
    Trans --> Content[Localized Content]
```

## Analytics Flow

```mermaid
flowchart TD
    Start[Page Load]
    Consent{Cookie Consent?}
    
    Start --> Consent
    Consent -->|No| ShowBanner[Show Consent Banner]
    Consent -->|Yes| LoadScripts[Load Analytics Scripts]
    
    ShowBanner --> UserChoice{User Choice}
    UserChoice -->|Accept| StoreConsent[Store Consent]
    UserChoice -->|Reject| NoTracking[No Tracking]
    
    StoreConsent --> LoadScripts
    LoadScripts --> InitGA[Initialize GA4]
    LoadScripts --> InitGAds[Initialize Google Ads]
    LoadScripts --> InitHS[Initialize HubSpot]
    
    InitGA --> TrackEvents[Track Events]
    InitGAds --> TrackConversions[Track Conversions]
    InitHS --> TrackLeads[Track Leads]
```

## Form Submission Flow

```mermaid
stateDiagram-v2
    [*] --> FormEmpty: User opens form
    FormEmpty --> FormFilling: User enters data
    FormFilling --> Validating: Submit clicked
    
    Validating --> ShowErrors: Validation fails
    ShowErrors --> FormFilling: User corrects
    
    Validating --> Submitting: Validation passes
    Submitting --> Success: API success
    Submitting --> Error: API error
    
    Success --> ShowToast: Display success
    Error --> ShowError: Display error
    ShowError --> FormFilling: User retries
    
    ShowToast --> [*]
```

## Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        Local[Local Dev - Vite :8080]
        Branch[Feature Branch]
    end
    
    subgraph "Preview"
        Vercel[Vercel Preview]
    end
    
    subgraph "Production"
        Netlify[Netlify Hosting]
        CDN[Netlify Edge CDN]
    end
    
    Local --> Branch
    Branch --> Vercel
    Vercel --> Netlify
    Netlify --> CDN
    CDN --> Users[End Users]
```

## Protected Components (Future Implementation)

```mermaid
graph TD
    subgraph "Protected Components"
        HBR[HeartBalanceRing]
        CFC[ContributingFactorCards]
        TN[TabNavigation]
        TT[TodayTab]
    end
    
    subgraph "Protection Reasons"
        Clinical[Clinical Accuracy]
        Regulatory[Regulatory Approval]
        Marketing[Marketing Ops]
        Licensed[Licensed Algorithm]
    end
    
    HBR -.-> Clinical
    CFC -.-> Regulatory
    TN -.-> Marketing
    TT -.-> Licensed
    
    style HBR fill:#ff9999
    style CFC fill:#ff9999
    style TN fill:#ff9999
    style TT fill:#ff9999
```