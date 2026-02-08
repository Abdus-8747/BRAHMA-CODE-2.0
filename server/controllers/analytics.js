import SessionResult from "../models/SessionResult.js";

/**
 * @route   GET /api/analytics/scores
 * @access  Private
 */
export const getScoreAnalytics = async (req, res) => {
  try {
    const results = await SessionResult.find({ user: req.user })
      .populate("session", "subject difficulty createdAt")
      .sort({ createdAt: 1 });

      console.log("Fetched session results for analytics:", results);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        chartData: {
          labels: [],
          datasets: [],
        },
        summary: {
          totalSessions: 0,
          overallAverageScore: 0,
        },
      });
    }

    // Chart.js friendly arrays
    const labels = [];
    const scores = [];
    const performanceLevels = [];

    results.forEach((r, index) => {
      labels.push(
        r.session?.subject
          ? `${r.session.subject} (${index + 1})`
          : `Session ${index + 1}`
      );
      scores.push(r.averageScore);
      performanceLevels.push(r.performanceLevel);
    });

    const overallAverageScore =
      scores.reduce((sum, s) => sum + s, 0) / scores.length;

    res.status(200).json({
      success: true,

      // 🔥 Perfect for Chart.js
      chartData: {
        labels,
        datasets: [
          {
            label: "Average Score",
            data: scores,
          },
        ],
      },

      // extra analytics
      performanceLevels,
      summary: {
        totalSessions: results.length,
        overallAverageScore: Math.round(overallAverageScore),
      },
    });
  } catch (error) {
    console.error("Score analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};