import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

import Home from './pages/Home';
import AddTopic from './pages/AddTopic';
import Favorites from './pages/Favorites';
import Stats from './pages/Stats';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import CompanyQuestions from './pages/CompanyQuestions';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import { Topic } from './types/Topic';

const App: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ track Firebase loading

  // Firebase Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false); // ✅ auth check done
    });
    return () => unsubscribe();
  }, []);

  // Fetch topics based on userId
  const fetchTopics = async () => {
    if (!user) return;

    try {
      const res = await axios.get<Topic[]>(
        `https://interview-prep-tracker-backend.onrender.com/api/topics/user/${user.uid}`
      );
      setTopics(res.data);
    } catch (err) {
      console.error('❌ Fetch topics error:', err);
    } finally {
      setLoadingTopics(false); // ✅ loading done
    }
  };

  // When user is logged in, fetch topics
  useEffect(() => {
    if (user) {
      fetchTopics();
    } else if (user === null) {
      setLoadingTopics(false); // ✅ exit loading if no user
    }
  }, [user]);

  // Update topic
  const updateTopic = async (updatedTopic: Topic) => {
    if (!user) return;

    try {
      const updatedWithUser = { ...updatedTopic, userId: user.uid };

      const res = await axios.put<Topic>(
        `http://localhost:8080/api/topics/${updatedTopic.id}`,
        updatedWithUser
      );

      setTopics((prev) =>
        prev.map((t) => (t.id === updatedTopic.id ? res.data : t))
      );
    } catch (err) {
      console.error('❌ Update topic error:', err);
    }
  };

  // Show a loading screen if Firebase or Topics are loading
  if (loadingUser || loadingTopics) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home
                topics={topics}
                updateTopic={updateTopic}
                setTopics={setTopics}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddTopic onAdd={fetchTopics} />
            </PrivateRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <Favorites topics={topics} updateTopic={updateTopic} />
            </PrivateRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <Stats />
            </PrivateRoute>
          }
        />

        <Route
          path="/company-questions"
          element={
            <PrivateRoute>
              <CompanyQuestions />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookmarks"
          element={
            <PrivateRoute>
              <Bookmarks topics={topics} updateTopic={updateTopic} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
