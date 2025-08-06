import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {faker} from "@faker-js/faker";

import {auth, db} from "./firebase";

export const seedDB = async () => {
  try {
    console.log("Database seeding started...");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const email = faker.internet.email({firstName, lastName}).toLowerCase();

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        `${firstName}${lastName}`
      );

      await setDoc(doc(db, "users", res.user.uid), {
        firstName: firstName,
        lastName: lastName,
        username: faker.internet.username({firstName, lastName}),
        email: email,
        imageUrl:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        timestamp: serverTimestamp(),
      });
      users.push(res.user.uid);
    }
    console.log("Seeded users.");

    console.log("Seeding communities...");
    for (let i = 0; i < 10; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      const res = await addDoc(collection(db, "communities"), {
        title: faker.lorem.paragraph(),
        description: faker.lorem.paragraphs(2),
        image:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        banner:
          "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
        createdBy: randomUser,
        members: arrayUnion(randomUser),
        timestamp: serverTimestamp(),
      });

      for (let i = 0; i < 5; i++) {
        await addDoc(collection(db, "posts"), {
          title: faker.lorem.paragraph(),
          content: faker.lorem.paragraph(3),
          image:
            "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          community: res.id,
          createdBy: randomUser,
          upVotes: [],
          downVotes: [],
          comments: [],
          timestamp: serverTimestamp(),
        });
      }
    }
    console.log("Seeded communities.");

    console.log("Database seeding complete!");
  } catch (error) {
    console.log(error);
  }
};
