import { Project, TeamMember, ResearchEntry, MediaItem, AdminUser, ActivityLog } from '../types';

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-001',
    name: 'Aarav V. Sharma',
    role: 'Co-Founder & Lead RF / Analog Systems Engineer',
    department: 'Communication',
    shortBio: 'Specializing in high-frequency RF front-ends, LC tank resonators, impedance matching, and analog signal processing.',
    detailedBio: 'Aarav leads the physical layer hardware architecture at BIT & VOLT. With deep focus on Electronics and Communication Engineering (ECE), his work encompasses discrete RF power amplifier design, LC bandpass filtering, impedance matching networks, and PCB signal integrity for high-reliability communication modules.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    skills: ['RF Circuit Design', 'Impedance Matching', 'AM/FM Modulation', 'PCB Design (KiCad/Altium)', 'Oscilloscope & VNA Testing', 'Analog Filtering'],
    technologies: ['RF Synthesizers', 'KiCad', 'LTspice', 'Spectrum Analyzers', 'Discrete Transistors', 'Antenna Matching'],
    expertise: ['RF Front-Ends', 'Analog Signal Processing', 'Wireless Communications'],
    github: 'https://github.com/aarav-sharma-ece',
    linkedin: 'https://linkedin.com/in/aarav-sharma-rf',
    email: 'aarav@bitandvolt.org',
    joinDate: '2025-01-10',
    status: 'Active',
    isFounder: true,
    projectCount: 4,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'team-002',
    name: 'Ananya R. Nair',
    role: 'Co-Founder & Lead Embedded & Firmware Architect',
    department: 'Embedded Systems',
    shortBio: 'Expert in low-level ARM Cortex firmware, FreeRTOS kernel design, Hardware-Software Co-Design, and DMA acceleration.',
    detailedBio: 'Ananya bridge hardware registers and software control at BIT & VOLT. Focusing on ECE & CSE integration, she designs ultra-low latency firmware for microcontrollers, hardware abstraction layers (HAL), custom bootloaders, and deterministic sensor sampling pipelines.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    skills: ['C/C++', 'ARM Cortex-M Firmware', 'FreeRTOS', 'I2C / SPI / UART / CAN', 'Embedded Linux', 'Hardware Debugging (JTAG/SWD)'],
    technologies: ['STM32', 'ESP32', 'FreeRTOS', 'GCC Toolchain', 'Rust for Embedded', 'Logic Analyzers'],
    expertise: ['Firmware Engineering', 'Real-Time Operating Systems', 'Microcontroller Security'],
    github: 'https://github.com/ananya-nair-embedded',
    linkedin: 'https://linkedin.com/in/ananya-nair-firmware',
    email: 'ananya@bitandvolt.org',
    joinDate: '2025-01-10',
    status: 'Active',
    isFounder: true,
    projectCount: 5,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'team-003',
    name: 'Devansh M. Kulkarni',
    role: 'Co-Founder & Lead Systems, AI & Software Engineer',
    department: 'Software',
    shortBio: 'Focusing on distributed edge computing, real-time signal processing, full-stack telemetry dashboards, and embedded AI.',
    detailedBio: 'Devansh directs software platform architecture, real-time data pipelines, and cyber-physical security across BIT & VOLT projects. Bridging Computer Science and Engineering (CSE), he builds full-stack dashboards, edge inference runtimes, and secure cloud sync gateways.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    skills: ['TypeScript / Node.js', 'Python / PyTorch', 'C++ Edge Computing', 'REST & WebSockets', 'Docker & Cloud Infra', 'Cybersecurity & Encryption'],
    technologies: ['React', 'Express.js', 'MongoDB', 'TensorFlow Lite', 'WebSockets', 'OpenCV'],
    expertise: ['Full-Stack Systems', 'Edge AI', 'Signal Processing Algorithms'],
    github: 'https://github.com/devansh-kulkarni-cse',
    linkedin: 'https://linkedin.com/in/devansh-kulkarni-dev',
    email: 'devansh@bitandvolt.org',
    joinDate: '2025-01-10',
    status: 'Active',
    isFounder: true,
    projectCount: 5,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    projectNumber: '001',
    slug: 'am-walkie-talkie',
    title: 'AM Walkie-Talkie / AM Voice Communication System',
    shortDescription: 'A custom-built dual-unit Amplitude Modulated (AM) transceiver system engineered from fundamental RF, analog filtering, and crystal oscillator principles.',
    fullDescription: 'The AM Walkie-Talkie system is BIT & VOLT’s foundational communications engineering project. Designed from discrete analog and RF circuit components, this dual-unit transceiver demonstrates fundamental wireless speech transmission, high-Q crystal carrier generation, double-balanced modulation, low-noise RF amplification, envelope detection, and high-selectivity audio recovery.',
    category: 'Communication',
    status: 'Prototyping',
    technologies: ['RF Electronics', 'AM Modulation', 'LC Resonator Filters', 'Envelope Detection', 'Crystal Oscillators', 'Audio Amplification'],
    hardware: [
      '27 MHz Quartz Crystal Resonator',
      '2N222A / 2N3904 NPN RF Transistors',
      '1N60 / 1N4148 Germanium Signal Diodes',
      'LM386 Low-Voltage Audio Power Amplifier',
      'Custom Air-Core & Ferrite Inductors',
      'Telescopic Whip Antenna (50Ω Matched)',
      'Double-Sided FR4 Custom PCB'
    ],
    software: ['KiCad EDA (Schematic & PCB Layout)', 'LTspice SPICE Simulation Engine', 'GNU Radio Signal Profiler'],
    teamMemberIds: ['team-001', 'team-002', 'team-003'],
    startDate: '2025-02-01',
    endDate: '2025-06-15',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    ],
    videos: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
    documentation: `
# AM Walkie-Talkie / AM Voice Communication System

## 1. Project Objective & Scope
The objective of **Project 001** is to construct a fully functional, handheld dual-unit Amplitude Modulated (AM) speech transceiver operating in the HF (High Frequency) band. The system provides half-duplex voice communications with analog noise filtering, discrete transistor amplification, and low power consumption suitable for portable battery operation.

## 2. System Architecture & Block Diagram
The transceiver is divided into three primary functional blocks:

1. **Transmitter Subsystem**:
   - Audio Preamplifier Stage (Electret mic input)
   - Modulator & Driver Stage (Collector-modulated AM)
   - RF Crystal Oscillator (27 MHz carrier reference)
   - RF Class-C Power Amplifier
   - Antenna Impedance Matching Network (Pi-Network)

2. **Receiver Subsystem**:
   - RF Front-End Bandpass Filter (LC Resonator)
   - Low Noise Amplifier (LNA)
   - Envelope Detector (Diode Demodulator)
   - Audio High-Pass / Low-Pass Bandpass Filter (300 Hz – 3.4 kHz)
   - LM386 Audio Power Amplifier & Speaker Driver

3. **Transmit/Receive (TR) Switch**:
   - Push-to-Talk (PTT) relay/switch routing the antenna and power rails dynamically between TX and RX blocks.

## 3. Circuit Design & Engineering Specifications
- **Carrier Crystal Reference**: High-stability 27.145 MHz quartz crystal.
- **Modulation Scheme**: Double Sideband Full Carrier (DSB-FC) AM.
- **Audio Bandwidth**: Standard speech channel (300 Hz – 3400 Hz).
- **RF Power Output**: Discrete 100mW – 250mW RF stage designed for short-to-medium range field operation.
- **Sensitivity**: Receiver front-end tuned for < 10 µV minimum detectable signal.

## 4. Hardware Components & Bill of Materials
- Transistors: High-frequency NPN RF transistors (2N2222A / 2N3904 / 2N3866)
- Diodes: Fast-switching Germanium 1N60 detector diodes
- ICs: LM386N-1 audio power driver
- Passives: Precision ceramic capacitors, high-Q air-core coils, metal film resistors
- Enclosure: Custom 3D-printed chassis with shielding paint for RF containment.

## 5. Testing & Range Results
- **Bench Top Testing**: Oscilloscope analysis confirmed clean 85% modulation depth without severe envelope clipping.
- **Spectrum Profiling**: Spurious harmonics reduced by >35dB using a 3-element Pi-matching filter network.
- **Field Range Test**: Achieved clear speech intelligibility over 350 meters in open field line-of-sight testing.
`,
    docSections: [
      {
        title: 'System Architecture',
        content: 'Transmitter, Receiver, PTT Switch, Audio Amplification, RF Front-End, Impedance Matching.'
      },
      {
        title: 'Transmitter Subsystem',
        content: 'Crystal oscillator at 27.145 MHz feeding a Class-C power stage modulated via collector voice injection.'
      },
      {
        title: 'Receiver Subsystem',
        content: 'LC tuned front end, LNA, envelope detector diode, audio bandpass filter, LM386 speaker driver.'
      }
    ],
    githubUrl: 'https://github.com/bitandvolt/am-walkie-talkie-ece',
    demoUrl: 'https://bitandvolt.org/projects/am-walkie-talkie',
    specs: [
      { label: 'Carrier Frequency', value: '27.145', unit: 'MHz' },
      { label: 'Modulation Type', value: 'AM (DSB-FC)', unit: '' },
      { label: 'RF Power Output', value: '250', unit: 'mW' },
      { label: 'Audio Bandwidth', value: '300 - 3400', unit: 'Hz' },
      { label: 'Supply Voltage', value: '9.0', unit: 'V DC' },
      { label: 'Antenna Impedance', value: '50', unit: 'Ω' },
      { label: 'Line-of-Sight Range', value: '350+', unit: 'm' }
    ],
    keyAchievements: [
      'Engineered discrete crystal carrier oscillator with stability < +/- 50 Hz',
      'Designed custom Pi-matching LC network suppressing harmonics by 38dB',
      'Achieved 85% modulation depth with minimal THD distortion on audio voice frequencies',
      'Fabricated double-sided compact FR4 PCB with dedicated ground plane for RF isolation'
    ],
    challenges: [
      {
        challenge: 'RF Harmonic Distortion and Stray Antenna Loading during transmission.',
        solution: 'Implemented a high-Q Pi-section low-pass filter and tuned impedance matching network between driver stage and 50 ohm whip antenna.'
      },
      {
        challenge: 'Audio distortion caused by non-linear envelope detection at low RX signal amplitude.',
        solution: 'Replaced silicon 1N4148 diodes with low forward voltage drop Germanium 1N60 diodes and introduced gentle DC bias to diode node.'
      }
    ],
    futureImprovements: [
      'Upgrade to Superheterodyne RX receiver with 455 kHz IF intermediate frequency transformer stages',
      'Add Automatic Gain Control (AGC) circuit to stabilize volume across variable distance ranges',
      'Integrate microcontroller-based PLL synthesizer for multi-channel frequency selection'
    ],
    featured: true,
    published: true,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'proj-002',
    projectNumber: '002',
    slug: 'autonomous-quadrotor-vision',
    title: 'Autonomous Quadrotor Drone with Edge Computer Vision',
    shortDescription: 'Custom flight controller integration paired with an onboard neural processing unit for GPS-denied obstacle avoidance and marker navigation.',
    fullDescription: 'Project 002 combines aeronautical robotics, sensor fusion, and real-time computer vision. Built on a carbon-fiber airframe, the drone features dual microcontroller/companion board topology: an STM32-based flight controller executing PID stabilization and an edge neural processor executing real-time object tracking.',
    category: 'Robotics',
    status: 'In Development',
    technologies: ['Robotics', 'Computer Vision', 'STM32 Microcontrollers', 'FreeRTOS', 'TensorFlow Lite Edge', 'PID Control'],
    hardware: [
      'Carbon Fiber 250mm Airframe',
      'STM32F405 Flight Controller Board',
      'Kria K26 SOM / Jetson Nano companion unit',
      'Brushless 2306 2400KV Motors',
      'Optical Flow + TOF Altitude Sensor',
      '4-in-1 30A BLHeli_32 ESCs'
    ],
    software: ['PX4 / Betaflight customized firmware', 'OpenCV C++', 'PyTorch Model Export', 'FreeRTOS Kernel'],
    teamMemberIds: ['team-002', 'team-003'],
    startDate: '2025-04-10',
    endDate: '2025-09-30',
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    documentation: `
# Autonomous Quadrotor Drone with Edge Vision

## Overview
An engineering investigation into low-latency obstacle detection on edge AI hardware attached directly to custom flight controller loops.
`,
    specs: [
      { label: 'Weight', value: '620', unit: 'g' },
      { label: 'Hover Time', value: '18', unit: 'mins' },
      { label: 'Vision Inference Speed', value: '42', unit: 'FPS' },
      { label: 'Communication Link', value: '2.4 GHz ExpressLRS', unit: '' }
    ],
    keyAchievements: [
      'Sub-20ms sensor fusion processing loop running on FreeRTOS',
      'Real-time ArUco tag precision landing auto-pilot'
    ],
    challenges: [
      {
        challenge: 'Vibration noise affecting IMU gyroscope readings during high RPM motor acceleration.',
        solution: 'Added TPU soft mounts and digital Butterworth notch filters in flight control firmware.'
      }
    ],
    futureImprovements: [
      'SLAM (Simultaneous Localization and Mapping) integration with stereo depth camera.'
    ],
    featured: true,
    published: true,
    createdAt: '2025-04-10T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'proj-003',
    projectNumber: '003',
    slug: 'industrial-iot-environmental-mesh',
    title: 'Industrial IoT Environmental Sensor Mesh Node',
    shortDescription: 'Ultra-low-power LoRa mesh networking node with solar energy harvesting and AES-128 encrypted sensor payload transmission.',
    fullDescription: 'Project 003 is a ruggedized hardware node designed for long-range remote monitoring of temperature, humidity, particulate matter, and dangerous gases in industrial environments.',
    category: 'IoT',
    status: 'Completed',
    technologies: ['IoT', 'LoRaWAN Mesh', 'Low Power Design', 'AES-128 Encryption', 'Solar Energy Harvesting', 'Embedded C++'],
    hardware: [
      'ESP32-S3 Microcontroller',
      'SX1262 LoRa Radio Transceiver (868/915 MHz)',
      'BME688 Gas & Environmental Sensor',
      'LiFePO4 Solar Charger & BMS IC',
      'IP67 Weatherproof Enclosure'
    ],
    software: ['ESP-IDF', 'Meshtastic Protocol Layer', 'Node.js / Express Gateway Backend', 'React Telemetry Dashboard'],
    teamMemberIds: ['team-001', 'team-002', 'team-003'],
    startDate: '2025-03-01',
    endDate: '2025-08-10',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    documentation: `
# Industrial IoT Environmental Sensor Mesh Node

Multi-hop mesh network nodes transmitting encrypted telemetry over 5+ km spans without cellular or Wi-Fi coverage.
`,
    specs: [
      { label: 'Transmission Range', value: '8.5', unit: 'km' },
      { label: 'Sleep Current', value: '14', unit: 'µA' },
      { label: 'Battery Lifespan', value: 'Indefinite (Solar)', unit: '' },
      { label: 'Payload Encryption', value: 'AES-128 GCM', unit: '' }
    ],
    keyAchievements: [
      'Achieved 14 µA deep sleep power envelope allowing year-round solar operation',
      'Self-healing multi-hop mesh topology tested across 6 distributed field nodes'
    ],
    challenges: [
      {
        challenge: 'Battery degradation during freezing outdoor winter conditions.',
        solution: 'Switched to LiFePO4 battery chemistry with integrated thermal sensing circuit.'
      }
    ],
    futureImprovements: [
      'On-node anomaly detection using TinyML.'
    ],
    featured: true,
    published: true,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'proj-004',
    projectNumber: '004',
    slug: 'sdr-spectrum-analyzer-neural-filter',
    title: 'SDR Spectrum Analyzer & Real-Time Neural Signal Filter',
    shortDescription: 'Software Defined Radio receiver processing pipe utilizing deep learning autoencoders for real-time RF interference mitigation.',
    fullDescription: 'Project 004 explores modern software-defined radio processing where high-speed ADC IQ samples are fed directly to a custom neural network filter to denoise signals in crowded spectrum bands.',
    category: 'AI/ML',
    status: 'Research',
    technologies: ['Software Defined Radio', 'Signal Processing', 'PyTorch Neural Networks', 'C++ DSP', 'FFT Accelerators', 'WebSockets'],
    hardware: [
      'RTL-SDR v4 Receiver Probe',
      'HackRF One Transceiver (1 MHz - 6 GHz)',
      'Low Noise Amplifier (LNA 20dB)',
      'Host Workstation with NVIDIA GPU'
    ],
    software: ['GNU Radio', 'PyTorch / ONNX C++ Runtime', 'FFTW3 Library', 'React + WebGL Canvas visualizer'],
    teamMemberIds: ['team-001', 'team-003'],
    startDate: '2025-06-01',
    endDate: undefined,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    documentation: `
# SDR Spectrum Analyzer & Real-Time Neural Signal Filter

Experimental research into denoising RF IQ streams using 1D convolutional autoencoders.
`,
    specs: [
      { label: 'Frequency Span', value: '1 MHz - 6 GHz', unit: '' },
      { label: 'Sample Rate', value: '20', unit: 'MSPS' },
      { label: 'Neural Latency', value: '1.8', unit: 'ms' }
    ],
    keyAchievements: [
      'Demonstrated 12dB SNR improvement in heavy impulse noise environments'
    ],
    challenges: [
      {
        challenge: 'CPU overload during real-time 20 MSPS FFT spectrogram generation.',
        solution: 'Offloaded FFT computation to GPU shaders and SIMD AVX2 vector instructions.'
      }
    ],
    futureImprovements: [
      'FPGA implementation of the neural weights for nanosecond-level filtering.'
    ],
    featured: false,
    published: true,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  }
];

export const INITIAL_RESEARCH: ResearchEntry[] = [
  {
    id: 'res-001',
    title: 'Low-Power Crystal-Stabilized RF Carrier Generation at 27 MHz',
    slug: 'crystal-stabilized-rf-carrier-27mhz',
    summary: 'An engineering study comparing Colpitts vs. Pierce crystal oscillator topologies for low-power handheld AM communication transceivers.',
    content: `
# Low-Power Crystal-Stabilized RF Carrier Generation at 27 MHz

## Abstract
Frequency stability in portable RF communication devices is vital to ensure minimal channel drift and tight receiver selectivity. In Project 001 (AM Walkie-Talkie), we evaluated discrete Pierce and Colpitts quartz crystal oscillator configurations.

## Oscillator Topology Comparison
1. **Pierce Oscillator**: High Q-factor, minimal component count, excellent stability, but sensitive to stray board capacitance.
2. **Colpitts Oscillator**: Easier start-up conditions at higher harmonic overtone frequencies, simplified output buffering.

## Measured Results
Using a 27.145 MHz HC-49/U crystal with 20pF load capacitors:
- **Frequency Drift**: < ± 25 Hz over 15°C to 45°C thermal ramp.
- **Phase Noise**: -105 dBc/Hz at 10 kHz offset.
- **Current Draw**: 3.2 mA at 9.0V DC supply.
`,
    category: 'RF Systems',
    author: 'Aarav V. Sharma',
    authorRole: 'Lead RF / Analog Systems Engineer',
    date: '2025-03-15',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    references: [
      'Hayward, W. (1998). Experimental Methods in RF Design. ARRL.',
      'Razavi, B. (2011). RF Microelectronics (2nd Edition). Prentice Hall.'
    ],
    tags: ['RF', 'Oscillators', 'AM Transmission', 'ECE'],
    status: 'Published',
    createdAt: '2025-03-15T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  },
  {
    id: 'res-002',
    title: 'Deterministic DMA Buffer Management for FreeRTOS Microcontroller Audio Processing',
    slug: 'dma-buffer-management-freertos-microcontroller',
    summary: 'Preventing audio dropouts and latency spikes in ARM Cortex-M microcontrollers through circular ping-pong DMA buffers.',
    content: `
# Deterministic DMA Buffer Management for FreeRTOS

## Introduction
Real-time embedded speech sampling requires strictly deterministic execution. Interrupt jitter during ADC sampling can introduce harmonic distortion into speech processing pipelines.

## Double Buffering (Ping-Pong) Scheme
By setting the Direct Memory Access (DMA) peripheral to circular mode with Half-Transfer (HT) and Transfer-Complete (TC) interrupts, the firmware processes Buffer A while hardware fills Buffer B without CPU intervention.
`,
    category: 'Embedded Systems',
    author: 'Ananya R. Nair',
    authorRole: 'Lead Embedded & Firmware Architect',
    date: '2025-05-20',
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    references: [
      'STMicroelectronics AN4031: Using STM32 DMA controller.',
      'FreeRTOS Real Time Kernel Developer Guide.'
    ],
    tags: ['Embedded', 'FreeRTOS', 'DMA', 'Cortex-M', 'Firmware'],
    status: 'Published',
    createdAt: '2025-05-20T00:00:00.000Z',
    updatedAt: '2026-07-22T00:00:00.000Z',
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-001',
    title: 'AM Walkie-Talkie Transceiver Schematic v1.2',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    cloudinaryPublicId: 'bit_volt/schematics/am_transceiver_v1',
    format: 'PNG',
    sizeBytes: 420000,
    width: 1920,
    height: 1080,
    category: 'Schematic',
    uploadedBy: 'Aarav V. Sharma',
    createdAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: 'med-002',
    title: 'AM Walkie-Talkie FR4 PCB 3D Render',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    cloudinaryPublicId: 'bit_volt/pcb/am_pcb_top',
    format: 'JPG',
    sizeBytes: 850000,
    width: 2048,
    height: 1536,
    category: 'PCB',
    uploadedBy: 'Ananya R. Nair',
    createdAt: '2025-03-01T00:00:00.000Z',
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-001',
    email: 'admin@bitandvolt.org',
    name: 'BIT & VOLT Lead Administrator',
    role: 'Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-07-22T07:45:00.000Z',
    status: 'Active',
    createdAt: '2025-01-01T00:00:00.000Z',
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    userId: 'admin-001',
    userName: 'BIT & VOLT Lead Administrator',
    userRole: 'Super Admin',
    action: 'INITIALIZE_SYSTEM',
    targetType: 'SYSTEM',
    details: 'System initialized with Project 001 (AM Walkie-Talkie) and founding team profiles.',
    timestamp: '2026-07-22T07:00:00.000Z',
    ip: '127.0.0.1'
  }
];
