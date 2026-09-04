export type Principle = {
  title: string;
  statement: string;
  practice: string;
};

export const editorialEn = {
    nav: { oaf: 'OAF', work: 'Practice', writing: 'Perspective', about: 'About', contact: 'Contact', privacy: 'Privacy' },
    home: {
      writingEyebrow: 'Perspective / Notes', writingTitle: 'Ideas should survive contact with execution.', writingBody: 'I publish short theses on architecture, strategy, portfolio, AI and transformation mechanisms. No content calendar — only when there is a point of view worth defending.', writingCta: 'Read the perspective',
      contactEyebrow: 'Contact', contactTitle: 'The best conversations start with a concrete problem, not a sales brief.', contactBody: 'If you are working on change that cuts across strategy, architecture, portfolio or technology, describe the context and the decision you are facing. I will respond when I see a useful point of connection.', contactCta: 'Send a message',
    },
    about: {
      introEyebrow: 'Operating philosophy', introTitle: 'Five principles that keep a decision system coherent.', introBody: 'These are not values for a wall. Each principle should change how a conversation is run, governance is designed, priorities are set and progress is evaluated.',
      principles: [
        { title: 'Clarity over volume', statement: 'A better decision matters more than a larger set of artifacts.', practice: 'In practice: a clear problem, explicit criteria, a decision owner and traceable consequences before another deck or model is created.' },
        { title: 'Architecture as leverage', statement: 'Architecture should increase the organization’s capacity to change.', practice: 'In practice: architectural choices connect to capabilities, investment, dependencies and delivery speed rather than stopping at technology standards.' },
        { title: 'Outcomes over activity', statement: 'Activity is not evidence of progress.', practice: 'In practice: project status matters when it can show a change in outcome, risk, cost, time or organizational capability.' },
        { title: 'Evidence over opinion', statement: 'A strong opinion remains a hypothesis until it meets evidence.', practice: 'In practice: assumptions are explicit and execution is designed to confirm, correct or invalidate them.' },
        { title: 'Human systems matter', statement: 'Accountability can invalidate the best target-state diagram.', practice: 'In practice: operating model, mandates, decision flow, funding and human behavior are treated as part of the architecture of the organization.' },
      ] as Principle[],
      bridgeTitle: 'Where I focus', bridgeBody: 'I see the greatest leverage not in optimizing a single function, but in designing the connections: strategy ↔ architecture, architecture ↔ portfolio, portfolio ↔ delivery and evidence ↔ the next decision.',
    },
    oaf: {
      layersTitle: 'Four layers — one decision loop', layersBody: 'Each layer answers a different question. The value appears only when the answers remain coherent and there is a real feedback mechanism.',
      layerDetails: [
        { title: 'Direction', question: 'Where are we changing the organization — and why?', body: 'Direction needs to be specific enough to distinguish a good decision from a convenient one. It includes outcomes, boundaries, trade-offs and success criteria.' },
        { title: 'Choices', question: 'Which architectural choices make that direction possible?', body: 'Strategy meets capabilities, target state, principles, constraints and deliberate compromises. A choice also means deciding what not to do.' },
        { title: 'Priorities', question: 'What do we fund, in what sequence, and at the expense of what?', body: 'Portfolio turns direction and choices into a sequence of investments. A priority needs an owner, dependencies and explicit criteria.' },
        { title: 'Evidence', question: 'What did execution teach us?', body: 'Delivery generates evidence about outcomes, risks and invalid assumptions. Evidence does not close the loop — it informs the next decision on direction, architecture or priority.' },
      ],
      principlesTitle: 'OAF principles', principlesLead: 'The model acts as a quality contract for decisions. The rules below matter more than the order of diagrams.',
      principles: [
        { title: 'Traceability', body: 'Every material initiative should have a visible trace to a strategic outcome and the decision that justifies its existence.' },
        { title: 'Explicit trade-offs', body: 'A decision without an opportunity cost is usually a wish. The trade-off should be named together with its consequence.' },
        { title: 'Portfolio is a choice', body: 'A portfolio is not a list of every good idea. It is a mechanism for deliberately limiting work to what matters most.' },
        { title: 'Architecture is executable', body: 'Architecture should change products, platforms, data, organization or funding — otherwise it remains a description.' },
        { title: 'Evidence can reverse a decision', body: 'When execution disproves an assumption, the system must allow correction without treating it as a governance failure.' },
        { title: 'One decision cadence', body: 'Strategy, architecture, portfolio and delivery need a shared review rhythm instead of four independent control calendars.' },
      ],
      usesTitle: 'Where this way of thinking is especially useful', uses: [
        { title: 'Transformation crosses multiple silos', body: 'When one initiative touches operating model, technology, data, funding and accountability at the same time.' },
        { title: 'The portfolio is overloaded', body: 'When the organization has more initiatives than real delivery capacity and needs common criteria for stopping work.' },
        { title: 'Architecture is losing influence', body: 'When models and standards are sound but do not change investment, product or technology decisions.' },
      ],
    },
    work: {
      introTitle: 'Practice starts with a decision problem.', introBody: 'I do not treat the areas below as a service catalog. They are perspectives I combine depending on where the organization is losing coherence, speed or decision quality.',
      areas: [
        { title: 'Enterprise Architecture', promise: 'From documentation to a mechanism for choice.', body: 'Designing capabilities, target state, principles, governance and roadmaps so they influence investment and the sequence of change.', questions: ['Which capabilities actually constrain the strategy?', 'Which decisions are reversible and which create long-lived debt?', 'Where does a standard help scale and where does it block value?'], outputs: 'Typical outputs: decision principles, capability view, target architecture, transition roadmap, governance cadence.' },
        { title: 'Strategy & Transformation', promise: 'From ambition to choices and an operating model.', body: 'Translating strategic direction into measurable outcomes, trade-offs, a change portfolio and accountability for execution.', questions: ['What needs to be true for the strategy to work?', 'Which capabilities need to be built or retired?', 'Which decisions need executive ownership?'], outputs: 'Typical outputs: strategic choices, transformation map, operating-model decisions, outcome tree, executive decision cadence.' },
        { title: 'PMO & Portfolio', promise: 'From a project list to allocation of capital and attention.', body: 'Building prioritization, dependency management and portfolio rhythm around value, constraints and outcomes rather than status reporting.', questions: ['What do we stop doing?', 'Which dependencies change investment sequence?', 'Does funding reflect the declared strategy?'], outputs: 'Typical outputs: portfolio criteria, dependency map, investment logic, outcome review, stop/start/continue decisions.' },
        { title: 'AI & Technology', promise: 'Technology adoption without losing accountability.', body: 'Connecting AI governance, cloud, platform engineering, DevSecOps and technology radar to real business scenarios and risk profiles.', questions: ['Where does AI create measurable advantage and where is it only a compelling demo?', 'How should guardrails match risk?', 'Which platform capabilities should be shared?'], outputs: 'Typical outputs: AI guardrails, technology principles, platform choices, adoption roadmap, risk and evidence model.' },
      ],
      intersectionsTitle: 'The biggest leverage sits between the areas.', intersections: ['Strategy ↔ Architecture: does the target state actually enable the direction?', 'Architecture ↔ Portfolio: are dependencies funded in the right sequence?', 'Portfolio ↔ Delivery: does limiting WIP improve speed and quality?', 'Delivery ↔ Strategy: does evidence change our assumptions and next priorities?'],
    },
    writing: { label: 'Perspective / Notes', title: 'Short essays on how decisions move through an organization.', body: 'I write mainly to make a thesis precise. Each piece starts with a concrete tension: strategy versus execution, governance versus speed, or innovation versus accountability.', read: 'Read', min: 'min' },
    contact: {
      title: 'Contact — Arkadiusz Kamrowski', description: 'Contact Arkadiusz Kamrowski about enterprise architecture, strategy, transformation, portfolio, AI, speaking and expert collaboration.', eyebrow: 'Contact', headline: 'Describe the problem that needs a better decision system.', lead: 'The most useful first message includes context, the decision to be made and key constraints. I do not need a long brief — a few concrete sentences are enough.', fitTitle: 'A good starting point', fit: ['enterprise architecture or target operating model', 'strategy and transformation portfolio', 'PMO, prioritization and governance', 'AI governance and responsible technology adoption', 'debate, panel, keynote or expert conversation'], formTitle: 'Send a message', formBody: 'The message is delivered directly to the configured email address. The form does not subscribe you to a newsletter or an automated CRM.', privacy: 'Data is used to handle the message and delivered through a transactional email service. See the privacy note for details.', linkedin: 'Prefer something shorter? Message me on LinkedIn.',
    },
    privacy: {
      title: 'Privacy — Arkadiusz Kamrowski', description: 'Information about data processing in the contact form on Arkadiusz Kamrowski’s website.', eyebrow: 'Privacy', headline: 'Minimum data. One purpose: respond to your message.', lead: 'The site does not use analytics or advertising trackers. The contact form processes only the data needed to deliver and handle your message.',
      sections: [
        { title: 'Data processed', body: 'Name, email address, optional organization, selected topic and message content. Basic technical data required to protect the form from abuse, such as an IP address, may also be processed.' },
        { title: 'Purpose', body: 'Only to deliver the message, respond and protect the form. Data is not automatically added to a newsletter, marketing profile or advertising system.' },
        { title: 'Email provider', body: 'The contact API uses Resend as the transactional email service. API keys and the destination address remain server-side and are never exposed to browser code.' },
        { title: 'Retention', body: 'The application itself does not create a database of submissions. Messages and technical logs may be retained by the mailbox and email provider according to their configuration and retention policies.' },
      ],
    },
  } as const;
