import React, { useState, useRef } from 'react';
import { ShieldCheck, Eye } from 'lucide-react';
import logoImg from '../logo.png';

export default function LegalModal({ onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      // Allow minor decimal rounding offsets
      const isBottom = el.scrollHeight - Math.ceil(el.scrollTop) <= el.clientHeight + 10;
      if (isBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  return (
    <div className="flex-center" style={{
      width: '100vw',
      height: '100vh',
      background: 'var(--bg-primary)',
      padding: '24px',
      flexDirection: 'column'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(#d4af37 0.7px, transparent 0.7px)',
        backgroundSize: '24px 24px',
        opacity: 0.02,
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        height: '100%',
        maxHeight: '85vh',
        border: '1px solid var(--border-gold)',
        boxShadow: '0 0 30px var(--gold-glow)',
        borderRadius: '8px',
        padding: '28px 36px',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInUp 0.5s ease-out'
      }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <img src={logoImg} alt="VOIDLEX Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--text-bright)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>Master Subscription & License Agreement</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              IMPERIAL EMINENCE CYBERGUARD CORPORATION • VOIDLEX SERVICES
            </p>
          </div>
        </div>

        {/* Scrolling Legal Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-dim)',
            borderRadius: '4px',
            padding: '28px',
            fontSize: '0.84rem',
            lineHeight: '1.75',
            color: 'var(--text-normal)',
            marginBottom: '24px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-bright)', fontSize: '1.1rem', marginBottom: '6px' }}>ENTERPRISE MASTER SERVICES AGREEMENT</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effective Date: April 1, 2026</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entity: IMPERIAL EMINENCE CYBERGUARD CORPORATION ("Company") • Product: VOIDLEX ("Services")</p>
          </div>

          <p style={{ marginBottom: '20px', fontStyle: 'italic' }}>
            This Enterprise Master Services Agreement ("Agreement") establishes the commercial, operational, and legal framework governing the access and utilization of the Services provided by Company to the legal entity ("Customer") executing an associated Order Form.
          </p>

          {/* --- PART I --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART I: CONTRACTUAL ARCHITECTURE AND GOVERNANCE
          </h3>
          
          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>1. Contractual Framework and Purpose</h4>
          <p style={{ marginBottom: '8px' }}><strong>1.1 Primary Governance:</strong> This Agreement establishes the foundational legal framework governing the relationship between Company and Customer regarding the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>1.2 Risk Allocation:</strong> The provisions herein establish the negotiated allocation of commercial and operational risk between the parties, forming the basis of the commercial bargain.</p>
          <p style={{ marginBottom: '8px' }}><strong>1.3 Operational Scope:</strong> This Agreement governs all instances of the Services, including production environments, staging environments, APIs, and beta deployments.</p>
          <p style={{ marginBottom: '8px' }}><strong>1.4 Entity Binding:</strong> The individual executing this Agreement represents and warrants they possess the requisite corporate authority to bind Customer.</p>
          <p style={{ marginBottom: '16px' }}><strong>1.5 Integration:</strong> This Agreement constitutes the complete and exclusive statement of the terms between the parties regarding its subject matter.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>2. Modular Architecture and Incorporation</h4>
          <p style={{ marginBottom: '8px' }}><strong>2.1 Supplementary Policies:</strong> The delivery of the Services is subject to supplementary governance documents designed to address specific technical parameters.</p>
          <p style={{ marginBottom: '8px' }}><strong>2.2 Acceptable Use Policy (AUP):</strong> This Agreement incorporates the AUP, which outlines the technical boundaries and permitted uses of the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>2.3 Privacy Policy:</strong> This Agreement incorporates the Privacy Policy, which governs the processing of technical telemetry and authentication metadata.</p>
          <p style={{ marginBottom: '8px' }}><strong>2.4 Data Processing Agreement (DPA):</strong> Where required by applicable law, a fully executed DPA shall be incorporated to govern the processing of regulated personal data.</p>
          <p style={{ marginBottom: '16px' }}><strong>2.5 Service Level Agreement (SLA):</strong> Commitments regarding platform availability and technical support are governed exclusively by the applicable SLA.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>3. Order of Precedence</h4>
          <p style={{ marginBottom: '8px' }}><strong>3.1 Document Hierarchy:</strong> In the event of an ambiguity or conflict between governing documents, a strict order of precedence shall apply.</p>
          <p style={{ marginBottom: '8px' }}><strong>3.2 Primary Control:</strong> An executed Enterprise Order Form holds controlling authority over conflicting terms within standard documentation.</p>
          <p style={{ marginBottom: '8px' }}><strong>3.3 Secondary Control:</strong> A fully executed DPA holds secondary controlling authority concerning data privacy and statutory compliance.</p>
          <p style={{ marginBottom: '8px' }}><strong>3.4 Tertiary Control:</strong> This Agreement holds tertiary controlling authority over operational and commercial matters.</p>
          <p style={{ marginBottom: '16px' }}><strong>3.5 Subordinate Policies:</strong> The AUP, Privacy Policy, and SLA operate as subordinate documents, interpreted to align with this Agreement.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>4. Version Control and Amendment</h4>
          <p style={{ marginBottom: '8px' }}><strong>4.1 Right of Modification:</strong> Company may periodically update this Agreement and incorporated policies to reflect operational or legal developments.</p>
          <p style={{ marginBottom: '8px' }}><strong>4.2 Notice Period:</strong> Company will provide thirty (30) days' written notice to Customer prior to the effective date of material modifications.</p>
          <p style={{ marginBottom: '8px' }}><strong>4.3 Delivery of Notice:</strong> Notice may be delivered via the administrative email associated with Customer's account or via the Services interface.</p>
          <p style={{ marginBottom: '8px' }}><strong>4.4 Customer Objection:</strong> If Customer reasonably objects to a material modification, Customer may terminate this Agreement by written notice prior to the effective date, receiving a pro-rated refund of unearned fees.</p>
          <p style={{ marginBottom: '16px' }}><strong>4.5 Continued Acceptance:</strong> Continued use of the Services following the effective date constitutes acceptance of the modified terms.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>5. Regulatory Change Modification</h4>
          <p style={{ marginBottom: '8px' }}><strong>5.1 Evolving Landscape:</strong> The parties acknowledge that artificial intelligence technologies are subject to evolving global regulatory frameworks.</p>
          <p style={{ marginBottom: '8px' }}><strong>5.2 Compliance Adjustments:</strong> Company reserves the right to modify the Services or this Agreement if reasonably required to ensure compliance with newly enacted statutory obligations.</p>
          <p style={{ marginBottom: '8px' }}><strong>5.3 Notice of Action:</strong> Company shall provide commercial notice of regulatory-driven modifications as soon as reasonably practicable.</p>
          <p style={{ marginBottom: '8px' }}><strong>5.4 No Breach:</strong> Actions taken pursuant to this Article 5 shall not constitute a breach of this Agreement.</p>
          <p style={{ marginBottom: '16px' }}><strong>5.5 Termination for Frustration:</strong> If regulatory changes render the provision of Services commercially unviable, Company may terminate this Agreement upon written notice.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>6. Electronic Execution</h4>
          <p style={{ marginBottom: '8px' }}><strong>6.1 Digital Assent:</strong> Assent to this Agreement may be manifested via electronic means, including deploying the software or digitally signing an Order Form.</p>
          <p style={{ marginBottom: '8px' }}><strong>6.2 Legal Equivalence:</strong> The parties agree that electronic execution holds the legal equivalence and enforceability of a physical signature.</p>
          <p style={{ marginBottom: '8px' }}><strong>6.3 Evidentiary Standard:</strong> Customer waives defenses asserting this Agreement is unenforceable solely because it was formed electronically.</p>
          <p style={{ marginBottom: '8px' }}><strong>6.4 Record Retention:</strong> Company's electronic logs recording acceptance shall be deemed conclusive evidence of execution.</p>
          <p style={{ marginBottom: '16px' }}><strong>6.5 Counterparts:</strong> Associated Order Forms may be executed in counterparts, each deemed an original.</p>


          {/* --- PART II --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART II: DEFINITIONS
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>7. "AI Outputs"</h4>
          <p style={{ marginBottom: '8px' }}><strong>7.1 Scope:</strong> "AI Outputs" means text, analytical summaries, code, structured data, or formatting generated by the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>7.2 Causation:</strong> This includes material generated in response to Customer Inputs or through Customer-initiated automated processes.</p>
          <p style={{ marginBottom: '8px' }}><strong>7.3 Exclusions:</strong> AI Outputs exclude user interface elements, proprietary platform code, and standard operational notifications.</p>
          <p style={{ marginBottom: '8px' }}><strong>7.4 Probabilistic Nature:</strong> The term recognizes such outputs result from probabilistic sequence prediction by neural networks.</p>
          <p style={{ marginBottom: '16px' }}><strong>7.5 Format Neutrality:</strong> Information remains an AI Output regardless of the format in which it is exported or integrated.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>8. "Customer Inputs"</h4>
          <p style={{ marginBottom: '8px' }}><strong>8.1 Scope:</strong> "Customer Inputs" means queries, prompts, contextual documents, and parameter configurations submitted by Customer.</p>
          <p style={{ marginBottom: '8px' }}><strong>8.2 Ingestion Method:</strong> This applies whether data is submitted via web interface, API, file upload, or automated pipeline.</p>
          <p style={{ marginBottom: '8px' }}><strong>8.3 Exclusions:</strong> Customer Inputs exclude technical telemetry, IP addresses, authentication tokens, and connection metadata.</p>
          <p style={{ marginBottom: '8px' }}><strong>8.4 State of Rest:</strong> The definition encompasses data solely in the form transmitted to Company's infrastructure.</p>
          <p style={{ marginBottom: '16px' }}><strong>8.5 Responsibility:</strong> The classification places the burden of legality and intellectual property authorization upon Customer.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>9. "Confidential Information"</h4>
          <p style={{ marginBottom: '8px' }}><strong>9.1 Designation:</strong> "Confidential Information" means non-public commercial, technical, or financial information disclosed by either party that is designated as confidential or reasonably understood as such.</p>
          <p style={{ marginBottom: '8px' }}><strong>9.2 Company Inclusions:</strong> Includes model architectures, API structures, unreleased beta features, pricing matrices, and security protocols.</p>
          <p style={{ marginBottom: '8px' }}><strong>9.3 Customer Inclusions:</strong> Includes proprietary workflows, internal documentation, and non-public data submitted as Customer Inputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>9.4 Format Neutrality:</strong> Information maintains confidential status whether disclosed orally, in writing, or via visual inspection.</p>
          <p style={{ marginBottom: '16px' }}><strong>9.5 Derivative Protection:</strong> Analyses or compilations derived from Confidential Information receive identical protection.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>10. "Services"</h4>
          <p style={{ marginBottom: '8px' }}><strong>10.1 Core Application:</strong> "Services" refers to the VOIDLEX software ecosystem and associated proprietary technologies.</p>
          <p style={{ marginBottom: '8px' }}><strong>10.2 Architectural Components:</strong> Includes APIs, cloud architecture, load balancers, and underlying algorithmic frameworks.</p>
          <p style={{ marginBottom: '8px' }}><strong>10.3 Documentation:</strong> Encompasses user manuals, technical specifications, and support documentation provided by Company.</p>
          <p style={{ marginBottom: '8px' }}><strong>10.4 Updates:</strong> Includes subsequent updates, security patches, and feature enhancements deployed during the Term.</p>
          <p style={{ marginBottom: '16px' }}><strong>10.5 Exclusions:</strong> Excludes third-party applications, operating systems, or local networks required by Customer to access the platform.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>11. "Authorized User"</h4>
          <p style={{ marginBottom: '8px' }}><strong>11.1 Authorization:</strong> "Authorized User" means an employee or contractor explicitly authorized by Customer to access the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>11.2 Seat Allocation:</strong> Authorization must occur under Customer's commercial account within the seat limits of the Order Form.</p>
          <p style={{ marginBottom: '8px' }}><strong>11.3 Unique Identity:</strong> Each Authorized User must utilize a unique credential; shared or departmental logins are prohibited.</p>
          <p style={{ marginBottom: '8px' }}><strong>11.4 Entity Relationship:</strong> Authorized Users must act directly on behalf of Customer's internal business operations.</p>
          <p style={{ marginBottom: '16px' }}><strong>11.5 Imputed Liability:</strong> Acts or omissions of Authorized Users are legally imputed to Customer.</p>


          {/* --- PART III --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART III: ACCESS PARAMETERS, SECURITY, AND OPERATIONS
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>12. Scope of License Grant</h4>
          <p style={{ marginBottom: '8px' }}><strong>12.1 Conditional Grant:</strong> Subject to compliance with this Agreement and payment of fees, Company grants an operational license.</p>
          <p style={{ marginBottom: '8px' }}><strong>12.2 Characteristics:</strong> The license is non-exclusive, non-transferable, non-sublicensable, and revocable for material breach.</p>
          <p style={{ marginBottom: '8px' }}><strong>12.3 Purpose Limitation:</strong> Access is granted solely for Customer's internal business operations.</p>
          <p style={{ marginBottom: '8px' }}><strong>12.4 Term Limitation:</strong> The license is valid only for the subscription term defined in the Order Form.</p>
          <p style={{ marginBottom: '16px' }}><strong>12.5 Reservation of Rights:</strong> Rights not expressly granted in this Article 12 are reserved by Company.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>13. License Restrictions</h4>
          <p style={{ marginBottom: '8px' }}><strong>13.1 Commercial Resale:</strong> Customer shall not reproduce, resell, sublicense, distribute, or lease the Services to third parties.</p>
          <p style={{ marginBottom: '8px' }}><strong>13.2 Bureau Services:</strong> Customer shall not operate the Services in a service bureau or managed service provider capacity.</p>
          <p style={{ marginBottom: '8px' }}><strong>13.3 Benchmarking:</strong> Customer shall not access the Services to monitor availability or functionality for competitive benchmarking.</p>
          <p style={{ marginBottom: '8px' }}><strong>13.4 Framing:</strong> Customer shall not frame or embed the user interfaces of the Services within unapproved external platforms.</p>
          <p style={{ marginBottom: '16px' }}><strong>13.5 Bypassing Controls:</strong> Customer shall not attempt to bypass licensing, security, or seat-allocation mechanisms.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>14. Authorized User Management</h4>
          <p style={{ marginBottom: '8px' }}><strong>14.1 Accountability:</strong> Customer is responsible for ensuring Authorized Users comply with this Agreement and the AUP.</p>
          <p style={{ marginBottom: '8px' }}><strong>14.2 Provisioning:</strong> Customer is responsible for securely provisioning and revoking access for departing Authorized Users.</p>
          <p style={{ marginBottom: '8px' }}><strong>14.3 Audit Rights:</strong> Company may electronically monitor concurrent usage to verify compliance with seat limitations.</p>
          <p style={{ marginBottom: '8px' }}><strong>14.4 Remediation:</strong> If usage exceeds contracted limitations, Customer shall remit payment for excess utilization at standard rates.</p>
          <p style={{ marginBottom: '16px' }}><strong>14.5 Breach Notification:</strong> Customer must notify Company upon discovering unauthorized use of credentials.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>15. Credential Security</h4>
          <p style={{ marginBottom: '8px' }}><strong>15.1 Safeguarding:</strong> Customer is responsible for maintaining the cryptographic security of its authentication credentials and API keys.</p>
          <p style={{ marginBottom: '8px' }}><strong>15.2 Endpoint Compromise:</strong> Company is not liable for unauthorized access resulting from compromised Customer endpoints or poor password hygiene.</p>
          <p style={{ marginBottom: '8px' }}><strong>15.3 Authentication:</strong> Customer is advised to implement Multi-Factor Authentication (MFA) for administrative accounts.</p>
          <p style={{ marginBottom: '8px' }}><strong>15.4 Key Rotation:</strong> Customer assumes responsibility for executing secure rotation of operational API keys.</p>
          <p style={{ marginBottom: '16px' }}><strong>15.5 Revocation:</strong> In the event of suspected compromise, Customer must execute credential revocation via the administrative console.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>16. Platform Modifications</h4>
          <p style={{ marginBottom: '8px' }}><strong>16.1 Continuous Improvement:</strong> Company may periodically update, refine, or modify the underlying algorithms and interfaces.</p>
          <p style={{ marginBottom: '8px' }}><strong>16.2 Deprecation:</strong> Company reserves the right to deprecate specific features or legacy AI models at its reasonable discretion.</p>
          <p style={{ marginBottom: '8px' }}><strong>16.3 Notice of Deprecation:</strong> Company will endeavor to provide sixty (60) days' notice prior to deprecating features material to core functionality.</p>
          <p style={{ marginBottom: '8px' }}><strong>16.4 Equivalency:</strong> Where commercially feasible, Company will attempt to replace deprecated features with equivalent functionality.</p>
          <p style={{ marginBottom: '16px' }}><strong>16.5 Permanence:</strong> Customer acknowledges specific generative models and interface workflows are not guaranteed to remain permanently available.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>17. Suspension of Services</h4>
          <p style={{ marginBottom: '8px' }}><strong>17.1 Emergency Suspension:</strong> Company may immediately suspend access to mitigate an imminent threat to network security.</p>
          <p style={{ marginBottom: '8px' }}><strong>17.2 AUP Violation:</strong> Company may suspend access if it reasonably determines Customer is in material breach of the AUP.</p>
          <p style={{ marginBottom: '8px' }}><strong>17.3 Financial Suspension:</strong> Access may be suspended, following reasonable notice, for failure to remit undisputed fees.</p>
          <p style={{ marginBottom: '8px' }}><strong>17.4 Restoration:</strong> Company shall restore access once the underlying cause for suspension is resolved to Company's reasonable satisfaction.</p>
          <p style={{ marginBottom: '16px' }}><strong>17.5 Liability:</strong> Company bears no liability for commercial disruptions resulting from a suspension executed in good faith.</p>


          {/* --- PART IV --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART IV: ARTIFICIAL INTELLIGENCE COMPLIANCE
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>18. Probabilistic Architecture</h4>
          <p style={{ marginBottom: '8px' }}><strong>18.1 Non-Deterministic Nature:</strong> Customer acknowledges the Services utilize models generating text via probabilistic sequencing.</p>
          <p style={{ marginBottom: '8px' }}><strong>18.2 Synthesis vs. Retrieval:</strong> Models do not retrieve verified facts from a determinative database, but synthesize responses based on training patterns.</p>
          <p style={{ marginBottom: '8px' }}><strong>18.3 Variability:</strong> Submitting identical prompts may yield varying AI Outputs due to the stochastic nature of the models.</p>
          <p style={{ marginBottom: '8px' }}><strong>18.4 Contextual Limits:</strong> Model understanding is limited to data provided within the active conversational session or payload.</p>
          <p style={{ marginBottom: '16px' }}><strong>18.5 Knowledge Cutoffs:</strong> Models possess temporal cutoffs and may not reflect events occurring after their final training epoch.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>19. Output Accuracy Disclaimer</h4>
          <p style={{ marginBottom: '8px' }}><strong>19.1 No Guarantee:</strong> Company does not guarantee the factual accuracy, legal validity, or logical consistency of AI Outputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>19.2 Algorithmic Inaccuracy:</strong> Customer acknowledges that generative AI may produce outputs that are factually inaccurate ("Hallucinations").</p>
          <p style={{ marginBottom: '8px' }}><strong>19.3 Plausibility:</strong> AI Outputs may appear structurally flawless while containing flawed or fabricated substance.</p>
          <p style={{ marginBottom: '8px' }}><strong>19.4 Fabricated Citations:</strong> Models may occasionally generate fabricated citations or invalid statutory references.</p>
          <p style={{ marginBottom: '16px' }}><strong>19.5 Verification Risk:</strong> The burden of identifying and correcting algorithmic inaccuracies rests entirely with Customer.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>20. Disclaimer of Professional Advice</h4>
          <p style={{ marginBottom: '8px' }}><strong>20.1 Vendor Classification:</strong> Company operates as a technology vendor; it does not operate as a law firm or consultancy.</p>
          <p style={{ marginBottom: '8px' }}><strong>20.2 No Engagement:</strong> The Services do not constitute the rendering of legal, tax, financial, or professional advisory services.</p>
          <p style={{ marginBottom: '8px' }}><strong>20.3 No Privilege:</strong> Use of the Services establishes no attorney-client relationship, and Customer Inputs are not shielded by evidentiary privilege via Company.</p>
          <p style={{ marginBottom: '8px' }}><strong>20.4 Informational Function:</strong> Services are provisioned as a tool to assist with preliminary drafting and structural formatting.</p>
          <p style={{ marginBottom: '16px' }}><strong>20.5 Fiduciary Prohibition:</strong> Customer shall not treat AI Outputs as binding counsel or represent them to third parties as professional advice.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>21. Mandatory Human Verification</h4>
          <p style={{ marginBottom: '8px' }}><strong>21.1 Responsibility:</strong> Customer assumes responsibility for independently verifying the accuracy, legality, and applicability of AI Outputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>21.2 Professional Review:</strong> Customer covenants that legal documentation drafted via the Services will undergo review by a licensed professional prior to execution.</p>
          <p style={{ marginBottom: '8px' }}><strong>21.3 Validation:</strong> Statutory references must be validated against recognized legal databases appropriate to the jurisdiction.</p>
          <p style={{ marginBottom: '8px' }}><strong>21.4 Error Mitigation:</strong> Customer holds operational responsibility to detect and strike algorithmic errors before reliance.</p>
          <p style={{ marginBottom: '16px' }}><strong>21.5 Dissemination Risk:</strong> Customer bears all liability arising from its external dissemination or commercial execution of AI Outputs.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>22. Prohibition on Automated Decision-Making</h4>
          <p style={{ marginBottom: '8px' }}><strong>22.1 Sole Reliance:</strong> Customer shall not utilize the Services as the sole basis for automated decision-making processes.</p>
          <p style={{ marginBottom: '8px' }}><strong>22.2 Significant Effects:</strong> This applies to decisions producing legal, financial, or similarly significant effects upon individuals.</p>
          <p style={{ marginBottom: '8px' }}><strong>22.3 Human-in-the-Loop:</strong> Integration of Services into automated workflows must include a "human-in-the-loop" review mechanism.</p>
          <p style={{ marginBottom: '8px' }}><strong>22.4 Legislative Compliance:</strong> This restriction supports compliance with global AI frameworks prohibiting unreviewed automated profiling.</p>
          <p style={{ marginBottom: '16px' }}><strong>22.5 Indemnification:</strong> Customer shall indemnify Company for regulatory claims arising from Customer's failure to enforce human oversight.</p>


          {/* --- PART V --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART V: INTELLECTUAL PROPERTY AND DATA PROCESSING
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>23. Company Intellectual Property</h4>
          <p style={{ marginBottom: '8px' }}><strong>23.1 Retention:</strong> Company and its licensors retain all right, title, and interest in and to the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>23.2 Assets:</strong> This ownership encompasses patents, copyrights, trademarks, trade secrets, model architectures, and algorithms.</p>
          <p style={{ marginBottom: '8px' }}><strong>23.3 Frameworks:</strong> Company retains ownership over orchestration logic and API schemas powering the platform.</p>
          <p style={{ marginBottom: '8px' }}><strong>23.4 No Implied Transfer:</strong> Nothing herein shall be construed as transferring ownership rights in Company's intellectual property.</p>
          <p style={{ marginBottom: '16px' }}><strong>23.5 Enforcement:</strong> Company reserves the right to protect its intellectual property through applicable legal remedies.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>24. Customer Intellectual Property</h4>
          <p style={{ marginBottom: '8px' }}><strong>24.1 Retention:</strong> Customer retains all right, title, and interest in and to the Customer Inputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>24.2 Output Ownership:</strong> Subject to Company's underlying rights in the Services, Customer claims ownership of the generated AI Outputs returned to them.</p>
          <p style={{ marginBottom: '8px' }}><strong>24.3 Similarity:</strong> Customer acknowledges the Services may generate identical or highly similar AI Outputs for other users.</p>
          <p style={{ marginBottom: '8px' }}><strong>24.4 Waiver:</strong> Customer waives claims of copyright infringement against Company based solely upon the generation of similar algorithmic outputs.</p>
          <p style={{ marginBottom: '16px' }}><strong>24.5 Infringement Liability:</strong> Customer assumes liability if Customer Inputs infringe upon the intellectual property rights of third parties.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>25. Stateless Processing Architecture</h4>
          <p style={{ marginBottom: '8px' }}><strong>25.1 Stateless Design:</strong> The Services utilize a stateless processing framework designed to minimize data persistence.</p>
          <p style={{ marginBottom: '8px' }}><strong>25.2 RAM Processing:</strong> Customer Inputs are processed within volatile memory strictly for the duration required to execute generation.</p>
          <p style={{ marginBottom: '8px' }}><strong>25.3 No Storage:</strong> Company does not commit Customer Inputs to long-term database storage, absent explicit opt-in features.</p>
          <p style={{ marginBottom: '8px' }}><strong>25.4 Ephemeral State:</strong> Once AI Outputs are transmitted, associated Customer Inputs are designated for overwrite in memory.</p>
          <p style={{ marginBottom: '16px' }}><strong>25.5 Security Intent:</strong> This architecture is maintained to isolate Customer from risks associated with persistent cloud storage of sensitive documents.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>26. Prohibition on Model Training</h4>
          <p style={{ marginBottom: '8px' }}><strong>26.1 Segregation:</strong> Company maintains segregation between the operation of the Services and the training pipelines of foundational models.</p>
          <p style={{ marginBottom: '8px' }}><strong>26.2 No Input Training:</strong> Company shall not utilize Customer Inputs to train, fine-tune, or refine its proprietary generative models.</p>
          <p style={{ marginBottom: '8px' }}><strong>26.3 No Output Training:</strong> Company shall not utilize resulting AI Outputs to adjust the algorithmic weighting of the models.</p>
          <p style={{ marginBottom: '8px' }}><strong>26.4 Protection:</strong> This ensures Customer's proprietary strategies and internal documents do not inform responses provided to other users.</p>
          <p style={{ marginBottom: '16px' }}><strong>26.5 Telemetry Exclusion:</strong> This restriction does not prevent Company from analyzing aggregated, anonymized technical telemetry to improve system performance.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>27. Feedback and Enhancements</h4>
          <p style={{ marginBottom: '8px' }}><strong>27.1 Submission:</strong> Customer may occasionally provide voluntary suggestions, bug reports, or feature requests ("Feedback").</p>
          <p style={{ marginBottom: '8px' }}><strong>27.2 License:</strong> Customer grants Company a perpetual, worldwide, royalty-free license to utilize and integrate Feedback into the Services.</p>
          <p style={{ marginBottom: '8px' }}><strong>27.3 Voluntary Nature:</strong> Feedback is provided without expectation of financial compensation or commercial credit.</p>
          <p style={{ marginBottom: '8px' }}><strong>27.4 Waiver:</strong> Customer waives moral rights or claims of authorship regarding features derived from Feedback.</p>
          <p style={{ marginBottom: '16px' }}><strong>27.5 Independent Development:</strong> Company retains the right to independently develop features similar to proposed Feedback.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>28. Cryptographic Standards</h4>
          <p style={{ marginBottom: '8px' }}><strong>28.1 In-Transit:</strong> Company shall utilize Transport Layer Security (TLS 1.2 or higher) to encrypt Customer Inputs transmitted to cloud infrastructure.</p>
          <p style={{ marginBottom: '8px' }}><strong>28.2 At-Rest:</strong> For operational metadata or optional storage, Company shall utilize AES-256 encryption for data at rest.</p>
          <p style={{ marginBottom: '8px' }}><strong>28.3 Key Management:</strong> Company maintains internal key management protocols to prevent unauthorized access to cryptographic keys.</p>
          <p style={{ marginBottom: '8px' }}><strong>28.4 Maintenance:</strong> Company shall not intentionally downgrade cryptographic protocols below accepted industry standards during the Term.</p>
          <p style={{ marginBottom: '16px' }}><strong>28.5 Customer Network:</strong> Customer remains responsible for encryption and security while data traverses Customer's local networks.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>29. Sub-processors</h4>
          <p style={{ marginBottom: '8px' }}><strong>29.1 Cloud Vendors:</strong> Delivery of the Services requires utilization of enterprise-grade cloud infrastructure providers.</p>
          <p style={{ marginBottom: '8px' }}><strong>29.2 Transient Processing:</strong> Providers act as sub-processors, transiently handling data strictly for compute orchestration.</p>
          <p style={{ marginBottom: '8px' }}><strong>29.3 Due Diligence:</strong> Company conducts technical due diligence to ensure sub-processors maintain adequate security certifications (e.g., SOC 2).</p>
          <p style={{ marginBottom: '8px' }}><strong>29.4 Restricted Use:</strong> Company binds sub-processors via agreements prohibiting unauthorized secondary usage of Customer Inputs.</p>
          <p style={{ marginBottom: '16px' }}><strong>29.5 Transparency:</strong> Company will provide a current list of primary infrastructure sub-processors upon written request.</p>


          {/* --- PART VI --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART VI: ACCEPTABLE USE AND SYSTEM INTEGRITY
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>30. Infrastructure Protection</h4>
          <p style={{ marginBottom: '8px' }}><strong>30.1 DoS Prohibition:</strong> Customer shall not execute Denial of Service (DoS) attacks against the platform.</p>
          <p style={{ marginBottom: '8px' }}><strong>30.2 Load Generation:</strong> Customer shall not conduct unauthorized volumetric testing or synthetic load generation.</p>
          <p style={{ marginBottom: '8px' }}><strong>30.3 Rate Limits:</strong> Customer shall adhere to API rate limits and connection caps established by Company.</p>
          <p style={{ marginBottom: '8px' }}><strong>30.4 Evasion:</strong> Customer shall not circumvent rate limits via proxy networks or secondary accounts.</p>
          <p style={{ marginBottom: '16px' }}><strong>30.5 Throttling:</strong> Company reserves the right to throttle connections presenting a threat to platform stability.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>31. Unauthorized Automation</h4>
          <p style={{ marginBottom: '8px' }}><strong>31.1 UI Interaction:</strong> Web interface interactions must be driven by human operators absent written permission for RPA.</p>
          <p style={{ marginBottom: '8px' }}><strong>31.2 Scrapers:</strong> Customer shall not utilize web scrapers or unauthorized extraction scripts to harvest AI Outputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>31.3 API Mandate:</strong> Programmatic interaction must be routed exclusively through authenticated VOIDLEX APIs.</p>
          <p style={{ marginBottom: '8px' }}><strong>31.4 Data Brokering:</strong> Customer shall not utilize automated means to build competing datasets from AI Outputs.</p>
          <p style={{ marginBottom: '16px' }}><strong>31.5 Detection:</strong> Company employs automated heuristics to detect and block unauthorized scraping vectors.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>32. Prompt Injection</h4>
          <p style={{ marginBottom: '8px' }}><strong>32.1 Guardrails:</strong> Company implements ethical and safety guardrails within the system prompts of the AI models.</p>
          <p style={{ marginBottom: '8px' }}><strong>32.2 Circumvention:</strong> Customer shall not execute adversarial prompt injections designed to bypass established guardrails.</p>
          <p style={{ marginBottom: '8px' }}><strong>32.3 Malicious Payloads:</strong> Customer shall not manipulate models into generating malware or exploiting code.</p>
          <p style={{ marginBottom: '8px' }}><strong>32.4 Accountability:</strong> Systemic attempts to breach safety guardrails constitute a material breach of this Agreement.</p>
          <p style={{ marginBottom: '16px' }}><strong>32.5 Reporting:</strong> Customer is expected to report inadvertently discovered prompt injection vulnerabilities to Company's security team.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>33. Model Extraction</h4>
          <p style={{ marginBottom: '8px' }}><strong>33.1 Protection of Weights:</strong> Algorithmic weights and routing logic constitute Company's protected trade secrets.</p>
          <p style={{ marginBottom: '8px' }}><strong>33.2 Extraction Attacks:</strong> Customer shall not systematically query APIs to map decision boundaries or conduct model extraction.</p>
          <p style={{ marginBottom: '8px' }}><strong>33.3 Distillation:</strong> Customer shall not utilize AI Outputs to train or construct a competing "student" AI model.</p>
          <p style={{ marginBottom: '8px' }}><strong>33.4 Reverse Engineering:</strong> Customer shall not reverse-engineer proprietary software binaries provided by Company.</p>
          <p style={{ marginBottom: '16px' }}><strong>33.5 Equitable Relief:</strong> Violations of this Article 33 may cause irreparable harm, entitling Company to seek injunctive relief without posting bond.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>34. Statutory Compliance</h4>
          <p style={{ marginBottom: '8px' }}><strong>34.1 Legal Adherence:</strong> Customer warrants its utilization of the Services shall comply with applicable statutes and regulations.</p>
          <p style={{ marginBottom: '8px' }}><strong>34.2 Criminal Activity:</strong> Services shall not be utilized to facilitate acts of fraud, cybercrime, or corporate espionage.</p>
          <p style={{ marginBottom: '8px' }}><strong>34.3 Defamation:</strong> Customer shall not utilize generative capabilities to mass-produce defamatory materials.</p>
          <p style={{ marginBottom: '8px' }}><strong>34.4 Evasion:</strong> Customer shall not utilize Services to construct frameworks intended to evade statutory compliance mandates.</p>
          <p style={{ marginBottom: '16px' }}><strong>34.5 Cooperation:</strong> Company may preserve metadata for law enforcement if faced with evidence of severe criminal utilization.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>35. Export Control</h4>
          <p style={{ marginBottom: '8px' }}><strong>35.1 Jurisdictions:</strong> The Services are subject to U.S., UK, and EU export control laws.</p>
          <p style={{ marginBottom: '8px' }}><strong>35.2 Embargoes:</strong> Customer warrants it is not located in any jurisdiction subject to comprehensive economic embargoes.</p>
          <p style={{ marginBottom: '8px' }}><strong>35.3 Restricted Parties:</strong> Customer represents it is not listed on governmental restricted parties lists.</p>
          <p style={{ marginBottom: '8px' }}><strong>35.4 Transfer:</strong> Customer shall not permit access to the Services by individuals in embargoed nations.</p>
          <p style={{ marginBottom: '16px' }}><strong>35.5 Termination:</strong> Discovery of export control violations shall result in immediate termination of access.</p>


          {/* --- PART VII --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART VII: CONFIDENTIALITY OBLIGATIONS
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>36. Standard of Care</h4>
          <p style={{ marginBottom: '8px' }}><strong>36.1 Responsibility:</strong> The receiving party holds a responsibility to maintain the secrecy of the disclosing party's Confidential Information.</p>
          <p style={{ marginBottom: '8px' }}><strong>36.2 Degree of Care:</strong> The receiving party shall protect Confidential Information using a commercially reasonable standard of care.</p>
          <p style={{ marginBottom: '8px' }}><strong>36.3 Security Measures:</strong> This mandates the implementation of robust access controls and network encryption.</p>
          <p style={{ marginBottom: '8px' }}><strong>36.4 Inadvertent Disclosure:</strong> The receiving party must take steps to prevent inadvertent disclosure in unsecured channels.</p>
          <p style={{ marginBottom: '16px' }}><strong>36.5 Breach Notification:</strong> The receiving party shall notify the disclosing party promptly upon discovering a suspected compromise.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>37. Authorized Disclosure</h4>
          <p style={{ marginBottom: '8px' }}><strong>37.1 Compartmentalization:</strong> The receiving party shall restrict internal access on a "need-to-know" basis.</p>
          <p style={{ marginBottom: '8px' }}><strong>37.2 Personnel:</strong> Disclosure is permitted solely to employees requiring access for the execution of this Agreement.</p>
          <p style={{ marginBottom: '8px' }}><strong>37.3 Contractors:</strong> Disclosure to external advisors is permitted if bound by written confidentiality agreements.</p>
          <p style={{ marginBottom: '8px' }}><strong>37.4 Liability:</strong> The receiving party remains liable for breaches committed by its personnel or contractors.</p>
          <p style={{ marginBottom: '16px' }}><strong>37.5 Public Commentary:</strong> Customer shall not publish reviews of unreleased beta features without Company's written consent.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>38. Exceptions</h4>
          <p style={{ marginBottom: '8px' }}><strong>38.1 Burden:</strong> Confidentiality obligations do not apply to information falling within the following exceptions.</p>
          <p style={{ marginBottom: '8px' }}><strong>38.2 Public Domain:</strong> Information that enters the public domain through no fault of the receiving party.</p>
          <p style={{ marginBottom: '8px' }}><strong>38.3 Prior Knowledge:</strong> Information rightfully in the receiving party's possession prior to disclosure.</p>
          <p style={{ marginBottom: '8px' }}><strong>38.4 Third-Party:</strong> Information rightfully received from a third party not bound by a secrecy obligation.</p>
          <p style={{ marginBottom: '16px' }}><strong>38.5 Independent Development:</strong> Information independently developed without reference to the disclosing party's Confidential Information.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>39. Compelled Disclosure</h4>
          <p style={{ marginBottom: '8px' }}><strong>39.1 Legal Mandate:</strong> If compelled by law or valid subpoena to disclose Confidential Information, specific protocols apply.</p>
          <p style={{ marginBottom: '8px' }}><strong>39.2 Notice:</strong> The receiving party shall provide prompt, prior written notice to the extent legally permissible.</p>
          <p style={{ marginBottom: '8px' }}><strong>39.3 Protective Order:</strong> Notice is designed to afford the disclosing party opportunity to seek a protective order.</p>
          <p style={{ marginBottom: '8px' }}><strong>39.4 Minimum Standard:</strong> The receiving party shall furnish only the narrow portion of information legally required.</p>
          <p style={{ marginBottom: '16px' }}><strong>39.5 Cooperation:</strong> The receiving party shall provide reasonable cooperation in efforts to secure confidential treatment.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>40. Return or Destruction</h4>
          <p style={{ marginBottom: '8px' }}><strong>40.1 Trigger:</strong> Upon expiration of this Agreement or written request, data destruction protocols initiate.</p>
          <p style={{ marginBottom: '8px' }}><strong>40.2 Tangible Assets:</strong> The receiving party shall return tangible embodiments of Confidential Information.</p>
          <p style={{ marginBottom: '8px' }}><strong>40.3 Digital Assets:</strong> The receiving party shall securely erase electronic copies residing on active local environments.</p>
          <p style={{ marginBottom: '8px' }}><strong>40.4 Backups Exception:</strong> Routine disaster recovery backups may be retained, provided they remain subject to perpetual confidentiality.</p>
          <p style={{ marginBottom: '16px' }}><strong>40.5 Certification:</strong> An authorized officer shall provide written certification of destruction upon request.</p>


          {/* --- PART VIII --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART VIII: WARRANTIES, DISCLAIMERS, AND LIABILITY
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>41. Mutual Representations</h4>
          <p style={{ marginBottom: '8px' }}><strong>41.1 Authority:</strong> Each party represents it is validly incorporated and possesses authority to execute this Agreement.</p>
          <p style={{ marginBottom: '8px' }}><strong>41.2 No Conflict:</strong> Each party warrants execution does not conflict with other binding commercial contracts.</p>
          <p style={{ marginBottom: '8px' }}><strong>41.3 Compliance:</strong> Each party warrants it shall operate in compliance with applicable laws in performance hereunder.</p>
          <p style={{ marginBottom: '8px' }}><strong>41.4 Malicious Code:</strong> Company warrants it uses commercially reasonable heuristics to prevent introduction of malware.</p>
          <p style={{ marginBottom: '16px' }}><strong>41.5 Signatories:</strong> Individuals authorizing this Agreement represent authority to bind their respective entities.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>42. Disclaimer of Warranties</h4>
          <p style={{ marginBottom: '8px' }}><strong>42.1 "As Is":</strong> To the maximum extent permitted by law, Services are delivered on an "as is" and "as available" basis.</p>
          <p style={{ marginBottom: '8px' }}><strong>42.2 General Disclaimer:</strong> Company expressly disclaims all warranties, whether express, implied, or statutory.</p>
          <p style={{ marginBottom: '8px' }}><strong>42.3 Merchantability:</strong> Company disclaims implied warranties of merchantability and fitness for a particular purpose.</p>
          <p style={{ marginBottom: '8px' }}><strong>42.4 Non-Infringement:</strong> Company disclaims implied warranties of non-infringement regarding stochastic AI Outputs.</p>
          <p style={{ marginBottom: '16px' }}><strong>42.5 Perfection:</strong> Company makes no warranty that Services will be uninterrupted or mathematically error-free.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>43. Exclusion of Indirect Damages</h4>
          <p style={{ marginBottom: '8px' }}><strong>43.1 Remote Damages:</strong> Neither party shall bear liability for indirect, incidental, special, consequential, or punitive damages.</p>
          <p style={{ marginBottom: '8px' }}><strong>43.2 Lost Profits:</strong> This exclusion explicitly covers loss of anticipated commercial profits or corporate goodwill.</p>
          <p style={{ marginBottom: '8px' }}><strong>43.3 Business Interruption:</strong> Neither party shall be liable for financial losses resulting from operational downtime.</p>
          <p style={{ marginBottom: '8px' }}><strong>43.4 Data Loss:</strong> Company is not liable for costs of reconstructing data resulting from Customer's failure to maintain backups.</p>
          <p style={{ marginBottom: '16px' }}><strong>43.5 Foreseeability:</strong> Exclusions apply regardless of whether damages were foreseeable.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>44. Limitation of Liability Cap</h4>
          <p style={{ marginBottom: '8px' }}><strong>44.1 Risk Allocation:</strong> The pricing of Services reflects the allocation of risk established by this limitation.</p>
          <p style={{ marginBottom: '8px' }}><strong>44.2 Aggregate Cap:</strong> Each party's total cumulative liability arising out of this Agreement shall be strictly capped.</p>
          <p style={{ marginBottom: '8px' }}><strong>44.3 Mathematical Limit:</strong> Liability shall not exceed total amounts paid by Customer to Company for Services giving rise to the claim.</p>
          <p style={{ marginBottom: '8px' }}><strong>44.4 Temporal Boundary:</strong> Calculation is limited to fees paid during the twelve (12) months preceding the incident.</p>
          <p style={{ marginBottom: '16px' }}><strong>44.5 Beta Tier:</strong> If utilizing a free or beta tier, aggregate liability is rigidly capped at One Hundred U.S. Dollars ($100.00 USD).</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>45. Non-Excludable Liability</h4>
          <p style={{ marginBottom: '8px' }}><strong>45.1 Exceptions:</strong> Limitations in Articles 43 and 44 shall not apply to specific categories of severe liability.</p>
          <p style={{ marginBottom: '8px' }}><strong>45.2 Misconduct:</strong> Liability is not capped regarding damages resulting from proven fraud or willful misconduct.</p>
          <p style={{ marginBottom: '8px' }}><strong>45.3 Indemnification:</strong> The cap shall not limit either party's indemnification obligations under Articles 46 and 47.</p>
          <p style={{ marginBottom: '8px' }}><strong>45.4 IP Breach:</strong> The cap shall not apply to damages resulting from Customer's material breach of model extraction clauses.</p>
          <p style={{ marginBottom: '16px' }}><strong>45.5 Statutory Unwaivability:</strong> No provision limits liability for personal injury or liability which cannot be lawfully excluded.</p>


          {/* --- PART IX --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART IX: INDEMNIFICATION PROTOCOLS
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>46. Indemnification Obligations</h4>
          <p style={{ marginBottom: '8px' }}><strong>46.1 Customer IP Indemnity:</strong> Customer shall indemnify Company against third-party claims alleging Customer Inputs infringe third-party intellectual property rights.</p>
          <p style={{ marginBottom: '8px' }}><strong>46.2 Customer AUP Indemnity:</strong> Customer shall indemnify Company against claims arising from Customer's material breach of the AUP.</p>
          <p style={{ marginBottom: '8px' }}><strong>46.3 Customer Output Indemnity:</strong> Customer shall indemnify Company against malpractice suits arising from Customer's commercial reliance on AI Outputs.</p>
          <p style={{ marginBottom: '8px' }}><strong>46.4 Company IP Indemnity:</strong> Company shall indemnify Customer against third-party claims alleging the core Services software infringes third-party intellectual property rights.</p>
          <p style={{ marginBottom: '16px' }}><strong>46.5 Financial Coverage:</strong> Indemnification covers reasonable attorneys' fees, court costs, and final settlement amounts or judgment awards.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>47. Indemnification Procedures</h4>
          <p style={{ marginBottom: '8px' }}><strong>47.1 Notice:</strong> The indemnified party shall endeavor to provide prompt written notice of any claim falling under these obligations.</p>
          <p style={{ marginBottom: '8px' }}><strong>47.2 Delay Prejudice:</strong> Delay in providing notice relieves the indemnifying party of obligations only to the extent it is materially prejudiced.</p>
          <p style={{ marginBottom: '8px' }}><strong>47.3 Defense Control:</strong> The indemnifying party possesses the right to assume exclusive control over defense and settlement.</p>
          <p style={{ marginBottom: '8px' }}><strong>47.4 Settlement Restriction:</strong> The indemnifying party shall not agree to a settlement mandating admission of fault without written consent.</p>
          <p style={{ marginBottom: '16px' }}><strong>47.5 Cooperation:</strong> The indemnified party shall provide reasonable administrative cooperation at the indemnifying party's expense.</p>


          {/* --- PART X --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART X: TERM, TERMINATION, AND DISPUTE RESOLUTION
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>48. Term and Renewal</h4>
          <p style={{ marginBottom: '8px' }}><strong>48.1 Initial Term:</strong> This Agreement commences upon the Effective Date and continues for the subscription period defined in the Order Form.</p>
          <p style={{ marginBottom: '8px' }}><strong>48.2 Automatic Renewal:</strong> Subscriptions automatically renew for successive, equivalent periods to prevent service disruption.</p>
          <p style={{ marginBottom: '8px' }}><strong>48.3 Non-Renewal Notice:</strong> Either party may prevent renewal by providing written notice thirty (30) days prior to term expiration.</p>
          <p style={{ marginBottom: '8px' }}><strong>48.4 Price Adjustments:</strong> Company reserves the right to adjust pricing for renewal terms upon forty-five (45) days' notice.</p>
          <p style={{ marginBottom: '16px' }}><strong>48.5 Survival:</strong> Expiration does not dissolve obligations regarding confidentiality, intellectual property, or liability limitations.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>49. Termination for Cause</h4>
          <p style={{ marginBottom: '8px' }}><strong>49.1 Right to Terminate:</strong> Either party may terminate prior to expiration if the other party commits a material breach.</p>
          <p style={{ marginBottom: '8px' }}><strong>49.2 Cure Period:</strong> The terminating party must provide written notice, granting a thirty (30) day cure period to rectify the failure.</p>
          <p style={{ marginBottom: '8px' }}><strong>49.3 Immediate Triggers:</strong> The cure period does not apply to model extraction attempts or export control failures, permitting immediate termination.</p>
          <p style={{ marginBottom: '8px' }}><strong>49.4 Insolvency:</strong> Either party may terminate if the other party files for bankruptcy or becomes insolvent.</p>
          <p style={{ marginBottom: '16px' }}><strong>49.5 Financial Remedies:</strong> Termination by Company does not relieve Customer of the obligation to pay fees owed for the remainder of the Term.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>50. Post-Termination Obligations</h4>
          <p style={{ marginBottom: '8px' }}><strong>50.1 Access Cessation:</strong> Upon termination, all licenses expire, and Customer's technical access to Services shall be severed.</p>
          <p style={{ marginBottom: '8px' }}><strong>50.2 Cessation of Use:</strong> Customer must cease utilization of APIs and destroy associated operational keys.</p>
          <p style={{ marginBottom: '8px' }}><strong>50.3 Data Export:</strong> Company may, at its discretion, provide a grace period solely to allow Customer to export retained data.</p>
          <p style={{ marginBottom: '8px' }}><strong>50.4 Asset Return:</strong> Parties shall execute return or destruction of Confidential Information per Article 40.</p>
          <p style={{ marginBottom: '16px' }}><strong>50.5 Transition Support:</strong> Company bears no obligation to provide transition services following termination.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>51. Governing Law and Venue</h4>
          <p style={{ marginBottom: '8px' }}><strong>51.1 Choice of Law:</strong> This Agreement shall be governed exclusively by the laws of England and Wales.</p>
          <p style={{ marginBottom: '8px' }}><strong>51.2 Conflict Rules:</strong> Governance applies without giving effect to conflict of law principles.</p>
          <p style={{ marginBottom: '8px' }}><strong>51.3 CISG Exclusion:</strong> The United Nations Convention on Contracts for the International Sale of Goods shall not apply.</p>
          <p style={{ marginBottom: '8px' }}><strong>51.4 UCITA Exclusion:</strong> The Uniform Computer Information Transactions Act shall not govern this agreement.</p>
          <p style={{ marginBottom: '16px' }}><strong>51.5 Consent to Venue:</strong> For actions exempted from arbitration, parties consent to the jurisdiction of courts in London.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>52. Mandatory Arbitration</h4>
          <p style={{ marginBottom: '8px' }}><strong>52.1 Negotiation:</strong> Parties shall attempt to resolve disputes through negotiation between senior executives before initiating proceedings.</p>
          <p style={{ marginBottom: '8px' }}><strong>52.2 Binding Arbitration:</strong> If negotiation fails after thirty (30) days, disputes shall be resolved by binding, confidential arbitration.</p>
          <p style={{ marginBottom: '8px' }}><strong>52.3 Rules:</strong> Arbitration shall be administered by LCIA (London Court of International Arbitration) in accordance with LCIA Commercial Arbitration Rules.</p>
          <p style={{ marginBottom: '8px' }}><strong>52.4 Arbitrator:</strong> The dispute shall be heard by a single, neutral arbitrator experienced in enterprise software disputes.</p>
          <p style={{ marginBottom: '16px' }}><strong>52.5 Location:</strong> The seat of arbitration shall be London, conducted exclusively in the English language.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>53. Class Action Waiver and Equitable Relief</h4>
          <p style={{ marginBottom: '8px' }}><strong>53.1 Individual Capacity:</strong> Entities may bring claims against the other only in their respective, individual capacities.</p>
          <p style={{ marginBottom: '8px' }}><strong>53.2 Waiver:</strong> Both parties waive the right to participate as a plaintiff or class member in any class action or representative proceeding.</p>
          <p style={{ marginBottom: '8px' }}><strong>53.3 No Consolidation:</strong> The arbitrator shall possess no authority to consolidate claims of multiple customers.</p>
          <p style={{ marginBottom: '8px' }}><strong>53.4 Carve-out:</strong> Company retains the right to seek immediate ex parte injunctive relief in a court of competent jurisdiction.</p>
          <p style={{ marginBottom: '16px' }}><strong>53.5 Scope:</strong> Such actions are permitted to restrain infringement of intellectual property, model extraction, or breaches of confidentiality.</p>


          {/* --- PART XI --- */}
          <h3 style={{ color: 'var(--gold-primary)', borderBottom: '1px solid var(--border-dim)', paddingBottom: '4px', marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            PART XI: GENERAL BOILERPLATE PROVISIONS
          </h3>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>54. Severability and Reformation</h4>
          <p style={{ marginBottom: '8px' }}><strong>54.1 Preservation:</strong> If any provision is determined to be invalid, remaining provisions shall survive intact.</p>
          <p style={{ marginBottom: '8px' }}><strong>54.2 Reformation:</strong> The invalid provision shall be reformed by the tribunal to the minimum extent necessary to ensure enforceability.</p>
          <p style={{ marginBottom: '8px' }}><strong>54.3 Alignment:</strong> Reformation shall be executed to preserve the original commercial intent and risk allocation.</p>
          <p style={{ marginBottom: '8px' }}><strong>54.4 Isolation:</strong> A ruling of unenforceability in one jurisdiction shall not automatically invalidate enforceability globally.</p>
          <p style={{ marginBottom: '16px' }}><strong>54.5 Bargain:</strong> The severability clause ensures the fundamental economic bargain of the contract survives localized challenges.</p>

          <h4 style={{ color: 'var(--text-bright)', fontSize: '0.88rem', margin: '12px 0 6px 0' }}>55. General Provisions</h4>
          <p style={{ marginBottom: '8px' }}><strong>55.1 No Waiver:</strong> Failure to strictly enforce any provision shall not constitute a present or future waiver of rights.</p>
          <p style={{ marginBottom: '8px' }}><strong>55.2 Assignment:</strong> Customer may not assign or transfer this Agreement without prior written consent of Company.</p>
          <p style={{ marginBottom: '8px' }}><strong>55.3 Corporate Reorganization:</strong> Company may freely assign this Agreement in the event of a merger, acquisition, or corporate reorganization.</p>
          <p style={{ marginBottom: '8px' }}><strong>55.4 Force Majeure:</strong> Neither party is liable for performance delays resulting from circumstances beyond reasonable control, excluding payment obligations.</p>
          <p style={{ marginBottom: '16px' }}><strong>55.5 Independent Contractors:</strong> Parties are independent commercial contractors; no partnership or joint venture is created herein.</p>

          <div style={{
            borderTop: '1px solid var(--border-dim)',
            paddingTop: '20px',
            marginTop: '24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.78rem'
          }}>
            [END OF ENTERPRISE MASTER SERVICES AGREEMENT]
          </div>
        </div>

        {/* User Interaction Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!hasScrolledToBottom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--warning-color)', background: 'rgba(245, 158, 11, 0.05)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <Eye size={14} />
              <span>Please scroll to the bottom of the Agreement to unlock acceptance.</span>
            </div>
          )}

          <label style={{
            display: 'flex',
            gap: '10px',
            fontSize: '0.82rem',
            color: 'var(--text-bright)',
            cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
            opacity: hasScrolledToBottom ? 1 : 0.5
          }}>
            <input 
              type="checkbox" 
              disabled={!hasScrolledToBottom} 
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
              style={{ accentColor: 'var(--gold-primary)' }}
            />
            <span>I have read, understood, and agree to be bound by the Universal Master Subscription, End-User License, and Confidentiality Agreement.</span>
          </label>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button 
              className="btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => window.close()}
            >
              Decline & Exit
            </button>
            <button 
              className="btn-premium" 
              style={{ flex: 2 }}
              disabled={!hasScrolledToBottom || !checkboxChecked}
              onClick={onAccept}
            >
              <div className="flex-center" style={{ gap: '8px' }}>
                <ShieldCheck size={16} />
                <span>Accept and Continue</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
