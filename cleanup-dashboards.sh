#!/bin/bash

# More comprehensive color cleanup for dashboard modules

# Replace colored background gradients and themed elements
find src/components/modules -name "*.tsx" -type f | while read file; do
  # Replace colored card backgrounds with white
  sed -i 's/bg-gradient-to-br from-white to-orange-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-emerald-50/bg-white/g' "$file"
  sed -i 's/bg-gradient-to-br from-white to-blue-50/bg-white/g' "$file"
  sed -i 's/border border-orange-100/border border-slate-200/g' "$file"
  sed -i 's/border border-emerald-100/border border-slate-200/g' "$file"
  sed -i 's/border border-blue-100/border border-slate-200/g' "$file"
  sed -i 's/border-2 border-orange-100/border border-slate-200/g' "$file"
  sed -i 's/border-2 border-emerald-100/border border-slate-200/g' "$file"
  sed -i 's/border-2 border-blue-100/border border-slate-200/g' "$file"
  sed -i 's/hover:border-orange-200/hover:border-slate-300/g' "$file"
  sed -i 's/hover:border-emerald-200/hover:border-slate-300/g' "$file"
  sed -i 's/hover:border-blue-200/hover:border-slate-300/g' "$file"
  
  # Replace colored text headings with teal
  sed -i 's/text-orange-600/text-teal-600/g' "$file"
  sed -i 's/text-emerald-600/text-teal-600/g' "$file"
  sed -i 's/text-blue-600/text-teal-600/g' "$file"
  sed -i 's/text-purple-600/text-teal-600/g' "$file"
  sed -i 's/text-violet-600/text-teal-600/g' "$file"
  
  # Replace shadow-xl with shadow-sm for lighter look
  sed -i 's/shadow-xl/shadow-sm/g' "$file"
  
  # Replace colored status badges with neutral
  sed -i 's/bg-orange-50/bg-slate-50/g' "$file"
  sed -i 's/bg-emerald-50/bg-slate-50/g' "$file"
  sed -i 's/bg-blue-50/bg-slate-50/g' "$file"
  sed -i 's/text-orange-700/text-slate-700/g' "$file"
  sed -i 's/text-emerald-700/text-slate-700/g' "$file"
  sed -i 's/text-blue-700/text-slate-700/g' "$file"
  
done

echo "✓ All dashboard module colors cleaned up!"
