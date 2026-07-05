/* =========================================================
   NEEVVILLE — Resume data (single source of truth)
   Edit THIS file to update resume content everywhere.
   Content rules:
   - GCP cert is IN PROGRESS (never "completed")
   - No phone number anywhere on the site
   - No WAM/GPA
   ========================================================= */
(function () {
  'use strict';

  var DATA = {
    name: 'Neev Bhandari',
    title: 'Backend Engineer',
    location: 'Melbourne, Australia',

    contact: {
      email: 'neevbhandari13@gmail.com',
      github: { label: 'github.com/NeevBhandari13', url: 'https://github.com/NeevBhandari13' },
      linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/neev-bhandari-976297206/' },
      pdf: 'assets/Neev-Bhandari-Resume.pdf',
    },

    /* ---------- CAREER GYM (Experience) ---------- */
    experience: [
      {
        employer: 'ANZ',
        location: 'Melbourne, Australia',
        roles: [
          {
            title: 'Backend Engineer',
            dates: 'May 2026 – Present',
            badge: { icon: '◈', color: '#e8433f', name: 'Retrieval Badge' },
            bullets: [
              "Built a RAG service for ANZ's internal documentation, indexing 500+ repositories, now adopted by 8 teams, driving internal enablement and engineering efficiency gains",
              'Led a hands-on workshop training engineers across the organisation to adopt and effectively use the RAG service',
              'Building an MCP server that aliases PII data, enabling agentic coding tools to safely assist engineers during live production incidents without exposing sensitive customer information',
            ],
          },
          {
            title: 'Graduate (Rotational Program)',
            dates: 'Feb 2025 – May 2026',
            badge: { icon: '❖', color: '#3f7fe8', name: 'Rotation Badge' },
            bullets: [
              'Wrote an automation script for Confluence migration that saved approximately 200 hours of manual work',
              'Selected as Events Lead for the Graduate Knowledge Committee, organising knowledge-sharing events across the graduate cohort',
            ],
            sections: [
              {
                heading: 'Rotation: Backend Engineer',
                bullets: [
                  'Designed and presented a commercial credit card solution to technical, non-technical, and senior leadership stakeholders, securing endorsement and driving the solution from concept to approval',
                  "Designed an endpoint to determine which bank accounts a customer is authorised to view, built to serve ANZ's 8 million customers at production scale",
                ],
              },
              {
                heading: 'Rotation: Quantitative Developer',
                bullets: [
                  'Parallelised the daily trade preparation function, cutting approximately 1 hour from the daily batch run through low-latency C++ optimisation',
                ],
              },
              {
                heading: 'Rotation: Business Analyst, ANZ Plus',
                bullets: [
                  'Translated technical and business requirements between engineering and stakeholder groups on ANZ Plus initiatives',
                  'Managed projects end-to-end, from requirements gathering through delivery',
                ],
              },
            ],
          },
          {
            title: 'Backend Engineer Intern',
            dates: 'Jan 2024 – Jul 2024',
            badge: { icon: '◉', color: '#3fb2e8', name: 'Pipeline Badge' },
            bullets: [
              'Used Go and gRPC to build transaction-processing APIs for the ANZ Plus application, integrating with Google Cloud Dataflow pipelines for scalable data processing',
            ],
          },
        ],
      },
      {
        employer: 'Monash DeepNeuron',
        location: 'Melbourne, Australia',
        roles: [
          {
            title: 'Project Lead',
            dates: 'Dec 2023 – Dec 2024',
            badge: { icon: '⬡', color: '#8e44e8', name: 'Parallel Badge' },
            bullets: [
              'Led a team to parallelise training of a CLIP model, increasing training efficiency',
              'Implemented data parallelism in CNN training, achieving a ~30% performance improvement',
            ],
          },
        ],
      },
      {
        employer: 'PwC',
        location: 'Melbourne, Australia',
        roles: [
          {
            title: 'Energy Transition MACRE Vacationer',
            dates: 'Nov 2023 – Jan 2024',
            badge: { icon: '▲', color: '#e8a13f', name: 'Valuation Badge' },
            bullets: [
              'Built financial models in Excel to project the financial performance of renewable energy assets',
              'Developed valuation decks for solar and wind farm investments, supporting strategic investment decision-making',
            ],
          },
        ],
      },
      {
        employer: 'Bank of Melbourne',
        location: 'Melbourne, Australia',
        roles: [
          {
            title: 'Customer Service Advisor',
            dates: 'Jul 2022 – Nov 2023',
            badge: { icon: '●', color: '#3fe87f', name: 'Service Badge' },
            bullets: [
              'Advised customers on banking product offerings (loans, accounts, credit cards), consistently outperforming sales targets while balancing service and issue resolution in a regulated environment',
            ],
          },
        ],
      },
      {
        employer: 'Anytime Fitness',
        location: 'Melbourne, Australia',
        roles: [
          {
            title: 'Membership Consultant',
            dates: 'Dec 2020 – Jul 2022',
            badge: { icon: '★', color: '#e83f9e', name: 'Hustle Badge' },
            bullets: [
              'Planned and led a one-day membership sale event end-to-end, driving 70+ membership sales in a single day while consistently exceeding individual sales targets',
            ],
          },
        ],
      },
    ],

    /* ---------- RESEARCH LAB (ProjectDex) ---------- */
    projects: [
      {
        no: '001',
        name: 'LeetCoach',
        types: ['Go', 'Next.js', 'GCP'],
        flavor: 'A full-stack creature that interviews you back.',
        description:
          "Full-stack mock interview platform with a Go backend and Next.js frontend, deployed on Google Cloud Run with Google Cloud Storage, integrating Anthropic's API to power an AI interviewer guiding candidates through the interview process and providing adaptive feedback.",
        link: { label: 'leetcoach.net', url: 'https://leetcoach.net' },
      },
      {
        no: '002',
        name: 'Custom Language Compiler',
        types: ['C++', 'x86-64'],
        status: 'Work in Progress',
        flavor: 'Evolves source code into optimized assembly.',
        description:
          'Compiler for a custom language targeting Linux on x86-64, implementing tokenizing, parsing, and code generation for optimized assembly output.',
      },
      {
        no: '003',
        name: 'Length-of-Stay Neural Net',
        types: ['R', 'Machine Learning'],
        flavor: 'Predicts how long patients linger in tall grass.',
        description:
          'Neural network to predict patient length of stay from hospital data, applying regularization and dropout to improve model generalization.',
      },
      {
        no: '004',
        name: 'Wireless EV Charging Sim',
        types: ['C', 'OpenMP', 'MPI'],
        flavor: 'Charges electric-type monsters in parallel.',
        description:
          'Simulated a wireless EV charging network using OpenMP for parallelism and MPI for distributed computation.',
      },
      {
        no: '005',
        name: 'Functional Guitar Hero',
        types: ['TypeScript', 'FP'],
        flavor: 'A rhythm-type with a purely functional cry.',
        description:
          'Rhythm game with a fully functional backend handling note timing, placement, and user interaction.',
      },
    ],

    /* ---------- ITEM MART (Skills) ---------- */
    skills: [
      { shelf: 'Languages', items: ['Python', 'Go', 'C++', 'Java', 'R', 'SQL', 'TypeScript'] },
      { shelf: 'Cloud & Data', items: ['Google Cloud Platform', 'BigQuery', 'Spanner', 'Cloud Storage', 'Cloud Run', 'Docker'] },
      { shelf: 'Tools & Platforms', items: ['Git / GitHub', 'Jira', 'VS Code', 'Claude Code'] },
    ],

    /* ---------- TRAINER SCHOOL (Education) ---------- */
    education: [
      {
        school: 'Monash University',
        location: 'Melbourne, Australia',
        program: 'Bachelor of Computer Science / Bachelor of Commerce',
        dates: 'Feb 2021 – Dec 2024',
        details: [
          'Majors: Advanced Computer Science, Business Analytics',
          'Coursework: Data Structures & Algorithms, OOP, Parallel Computing, Statistical Machine Learning, High Dimensional Data Analysis, Statistics & Applications, Econometrics',
        ],
      },
      {
        school: 'UC Berkeley',
        location: 'Berkeley, California',
        program: 'Innovation & Entrepreneurship in Silicon Valley',
        dates: 'Jul 2023',
        details: ['Intensive program covering entrepreneurship fundamentals, including design sprints and pitching.'],
      },
    ],

    certifications: [
      { name: 'Google Cloud Associate Cloud Engineer', status: 'In Progress' },
    ],
  };

  /* Browser: window.DATA (game + panels). Node: module.exports (tools/generate.js). */
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
  else window.DATA = DATA;
})();
