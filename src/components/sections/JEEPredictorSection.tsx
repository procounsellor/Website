import { useNavigate } from "react-router-dom";

export function JEEPredictorSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rank Predictor Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div
              className="p-8 h-full flex items-center justify-between"
              style={{
                background: "linear-gradient(101.59deg, #FBC8AB 0.68%, #FDF8F5 67.02%)",
              }}
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    className="mb-3"
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      color: "#111827",
                    }}
                  >
                    Rank Predictor
                  </h3>
                  <p 
                    className="leading-relaxed mb-6"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      color: "#6B7280",
                    }}
                  >
                    Predict your JEE rank based on your performance and get
                    insights into your competitive standing.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/jee-rank-predictor")}
                    className="text-gray-900 underline font-medium text-sm hover:text-gray-700 transition-colors"
                  >
                    Predict Rank
                  </button>
                  <button
                    onClick={() => navigate("/jee-rank-predictor")}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Predict Rank"
                  >
                    <img 
                      src="/button-arrow.png" 
                      alt="Arrow" 
                      className="object-contain"
                    />
                  </button>
                </div>
              </div>

              <div className="ml-6 shrink-0">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img 
                    src="/ranking-1.png" 
                    alt="Rank Predictor Icon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* College Predictor Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div
              className="p-8 h-full flex items-center justify-between"
              style={{
                background: "linear-gradient(101.59deg, #AFE17C 0.68%, #FDF8F5 67.02%)",
              }}
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    className="mb-3"
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      color: "#111827",
                    }}
                  >
                    College Predictor
                  </h3>
                  <p 
                    className="leading-relaxed mb-6"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      color: "#6B7280",
                    }}
                  >
                    Discover which colleges you can get into based on your rank
                    and preferences.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/jee-college-predictor")}
                    className="text-gray-900 underline font-medium text-sm hover:text-gray-700 transition-colors"
                  >
                    Predict College
                  </button>
                  <button
                    onClick={() => navigate("/jee-college-predictor")}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Predict College"
                  >
                    <img 
                      src="/button-arrow.png" 
                      alt="Arrow" 
                      className="object-contain"
                    />
                  </button>
                </div>
              </div>

              <div className="ml-6 shrink-0">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img 
                    src="/mortarboard-1.png" 
                    alt="College Predictor Icon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

