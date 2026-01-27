#!/bin/bash

# Replace common gradient patterns with simple teal colors
find src/components -name "*.tsx" -type f | while read file; do
  # Replace all indigo/purple gradients
  sed -i 's/bg-linear-to-r from-indigo-600 to-purple-600/bg-teal-600/g' "$file"
  sed -i 's/bg-linear-to-br from-indigo-600 to-purple-600/bg-teal-600/g' "$file"
  sed -i 's/from-indigo-600 to-purple-600/teal-600/g' "$file"
  sed -i 's/from-indigo-100 to-purple-100/teal-100/g' "$file"
  
  # Replace blue gradient backgrounds
  sed -i 's/bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100/bg-gray-50/g' "$file"
  sed -i 's/bg-linear-to-br from-blue-50 to-indigo-100/bg-gray-50/g' "$file"
  
  # Replace other colored gradients with single colors
  sed -i 's/bg-gradient-to-br from-white to-violet-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-cyan-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-emerald-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-orange-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-blue-50/bg-white/g' "$file"
  
  # Replace button gradients
  sed -i 's/bg-gradient-to-r from-red-600 to-orange-600/bg-red-600/g' "$file"
  sed -i 's/bg-gradient-to-r from-cyan-600 to-blue-600/bg-teal-600/g' "$file"
  sed -i 's/bg-gradient-to-r from-emerald-600 to-green-600/bg-teal-600/g' "$file"
  sed -i 's/bg-gradient-to-r from-orange-600 to-red-600/bg-orange-600/g' "$file"
  
  # Replace text gradients with solid colors
  sed -i 's/bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent/text-teal-600/g' "$file"
  sed -i 's/bg-linear-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent/text-orange-600/g' "$file"
  
  # Replace focus colors
  sed -i 's/focus:ring-2 focus:ring-indigo-500/focus:ring-2 focus:ring-teal-500/g' "$file"
  sed -i 's/focus:ring-2 focus:ring-cyan-500/focus:ring-2 focus:ring-teal-500/g' "$file"
  
  # Replace link colors
  sed -i 's/text-indigo-600 font-semibold hover:text-purple-600/text-teal-600 font-semibold hover:text-teal-700/g' "$file"
  sed -i 's/text-indigo-600 hover:text-indigo-700/text-teal-600 hover:text-teal-700/g' "$file"
  
done

echo "✓ All color gradients have been simplified to teal theme!"
