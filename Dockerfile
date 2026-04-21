# ... (Tahap build npm run build tetap sama) ...

FROM node:20-alpine
WORKDIR /app
# Install server sederhana untuk menjalankan file statis
RUN npm install -g serve
# Ambil hasil build
COPY --from=build-stage /app/dist ./dist

# Jalankan di port 5174 sesuai keinginan Anda
EXPOSE 5174
CMD ["serve", "-s", "dist", "-l", "5174"]