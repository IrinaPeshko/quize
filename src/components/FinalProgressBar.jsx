import React, { useEffect, useState } from "react";

const ProgressBar = ({ title, progress, animationDuration }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentProgress(progress);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [progress]);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - start;
      const newProgress = Math.min(
        progress * (elapsedTime / animationDuration),
        progress
      );
      setDisplayProgress(Math.round(newProgress));
      if (elapsedTime >= animationDuration) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress]);

  const styles = {
    container: {
      marginBottom: "20px",
      width: "80vw",
      maxWidth: "700px",
    },
    title: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    barContainer: {
      height: "10px",
      backgroundColor: "#e0e0e0",
      borderRadius: "5px",
      overflow: "hidden",
    },
    bar: {
      height: "100%",
      borderRadius: "5px",
      backgroundColor: currentProgress === 100 ? "#6200ee" : "#6200ea",
      width: `${currentProgress}%`,
      transition: "width 7s ease-in-out",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <p>{title}</p>
        <p>{displayProgress}%</p>
      </div>
      <div style={styles.barContainer}>
        <div
          style={{
            ...styles.bar,
            width: `${currentProgress}%`,
            backgroundColor: progress === 100 ? "#6200ee" : "#6200ea",
          }}
        />
      </div>
    </div>
  );
};

const FinalProgressBar = ({ answerResults }) => {
  const animationDuration = 7000;
  const [animatedProgress, setAnimatedProgress] = useState(
    answerResults.map(() => 0)
  );
  useEffect(() => {
    answerResults.forEach((groupResults, index) => {
      setTimeout(() => {
        setAnimatedProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = calculateProgress(groupResults);
          return newProgress;
        });
      }, animationDuration * index);
    });
  }, [answerResults]);
  const calculateProgress = (results) => {
    const correctAnswers = results.filter((result) => {
      if (result || result === null) {
        return true;
      }
    }).length;
    const totalQuestions = results.length;
    return (correctAnswers / totalQuestions) * 100;
  };
  const progressBarData = answerResults.map((groupResults, index) => ({
    title: `Group ${index + 1}`,
    progress: calculateProgress(groupResults),
  }));

  return (
    <div>
      {progressBarData.map((item, index) => (
        <ProgressBar
          key={index}
          title={item.title}
          progress={animatedProgress[index]}
          animationDuration
        />
      ))}
    </div>
  );
};

export default FinalProgressBar;
