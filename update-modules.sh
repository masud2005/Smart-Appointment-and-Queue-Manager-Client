#!/bin/bash

# Update AppointmentPage.tsx imports
sed -i "s|import { useMemo, useState } from 'react';|import { useMemo, useState } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';|g" src/components/modules/appoinment/AppointmentPage.tsx
sed -i 's|AlertCircle,|AlertCircle,|g' src/components/modules/appoinment/AppointmentPage.tsx

# Update return statement
sed -i 's|return (|return (\n    <motion.div \n      className="space-y-6"\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      transition={{ duration: 0.3 }}\n    >|' src/components/modules/appoinment/AppointmentPage.tsx

echo "Updates applied"
