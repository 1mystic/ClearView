

useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setUser({ id: userDoc.id, ...userDoc.data() });
            setIsAdmin(true);
          } 
          else if (userDoc.exists() && userDoc.data().role === "ngo") {
            setUser({ id: userDoc.id, ...userDoc.data() }); 
            setIsAdmin(false);
          }
          else {
            setUser({ id: userDoc.id, ...userDoc.data() });
            setIsAdmin(false);
          }
        } 
        catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } 
      else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
