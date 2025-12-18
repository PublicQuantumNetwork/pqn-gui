# PQN GUI

**Web interface for Public Quantum Network (PQN) nodes**

An interactive web interface designed for the general public to interact with quantum networks.

<p align="center">
  <img src="public/images/frontend_screenshot.png" alt="PQN Web Interface" width="800"/>
  <br>
  <em>PQN web interface for public interaction with a quantum network</em>
</p>

> [!NOTE]
> For complete project information, architecture details, and backend setup, see the [pqn-stack repository](https://github.com/PublicQuantumNetwork/pqn-stack).

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm package manager
- A PQN Node API (see [pqn-stack](https://github.com/PublicQuantumNetwork/pqn-stack))

### Installation

If you've just installed the PQN Node API, make sure not to be in the pqn-stack directory. A convenient place to put the GUI is in the same place you cloned pqn-stack.

1. **Clone the repository**

   ```bash
   git clone https://github.com/PublicQuantumNetwork/pqn-gui.git
   cd pqn-gui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Running the Development Server

1. Run the PQN Node API.
  
2. Open a new terminal window to run:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the interface.

### Building for Production

```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

## Configuration

The frontend expects the PQN Node API to be running at `http://127.0.0.1:8000` by default.

To configure the API endpoints, create a `.env.local` file in the root of the project:

```bash
NEXT_PUBLIC_TIMETAGGER_ADDRESS=127.0.0.1:8000
NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS=127.0.0.1:8000
```

Replace the addresses with your actual Node API endpoints if they differ from the defaults.

## Learn More

- [pqn-stack](https://github.com/PublicQuantumNetwork/pqn-stack) - Backend software stack and complete project documentation
- [Public Quantum Network](https://publicquantumnetwork.org) - Learn more about the PQN project
