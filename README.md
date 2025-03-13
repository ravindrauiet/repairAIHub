# RepairAIHub - Repair Services Platform

A modern, responsive website for RepairAIHub, a company specializing in repair services for TVs, mobile phones, AC units, refrigerators, and RO systems.

## Features

- Responsive design that works on mobile, tablet, and desktop devices
- Detailed service pages for each repair service
- Online booking system for scheduling repairs
- Contact form for inquiries
- Clean, professional UI with intuitive navigation

## Technologies Used

- React.js
- Vite
- React Router for navigation
- Pure CSS (no frameworks)
- JavaScript (ES6+)

## Project Structure

```
repair-services/
├── public/
│   └── images/
│       └── services/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── services/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/repair-services.git
   cd repair-services
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```
npm run build
```

The build files will be located in the `dist` directory.

## Customization

### Adding New Services

To add a new service, update the `src/data/services.js` file with the new service information following the existing format.

### Changing Styles

The project uses CSS variables for consistent styling. You can modify the color scheme, typography, and other design elements by editing the variables in `src/styles/globals.css`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or inquiries, please contact info@repairaihub.com.
