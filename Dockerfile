# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# install nodemon
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Add wait-for-it script
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh


# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["./wait-for-it.sh", "mongo:27017", "--", "npm", "start"]



