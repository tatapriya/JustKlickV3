import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { categoryData } from "../data/categoryData";

const ratings = ["4.5 above", "4.0 above", "3.5 above"];

const slugAliases = {
  "software-training": "training-institutes",
  overseas: "overseas-education",
  more: "career-guidance",
};

const categoryTitles = {
  colleges: {
    title: "Colleges",
    subtitle: "Degree programs and institutions",
    mainFilterTitle: "College Type",
    feeMax: 250000,
  },
  hostels: {
    title: "Hostels",
    subtitle: "Rooms and student stay options",
    mainFilterTitle: "Hostel Type",
    feeMax: 20000,
  },
  "overseas-education": {
    title: "Overseas Education",
    subtitle: "Abroad education consulting",
    mainFilterTitle: "Country",
    feeMax: 100000,
  },
  "training-institutes": {
    title: "Software Training",
    subtitle: "Learning and software courses",
    mainFilterTitle: "Training Type",
    feeMax: 100000,
  },
  "career-guidance": {
    title: "Career Guidance",
    subtitle: "Career support and counselling services",
    mainFilterTitle: "Service Type",
    feeMax: 50000,
  },
  exams: {
    title: "Competitive Exams",
    subtitle: "Exam coaching and preparation institutes",
    mainFilterTitle: "Exam Type",
    feeMax: 150000,
  },
};

export default function CategoryListingPage() {
  const { categorySlug } = useParams();

  const routeSlug = categorySlug || "colleges";
  const dataKey = slugAliases[routeSlug] || routeSlug;

  const pageInfo = categoryTitles[dataKey] || {
    title: "Category",
    subtitle: "Explore available listings",
    mainFilterTitle: "Category",
    feeMax: 500000,
  };

  const data = categoryData?.[dataKey] || [];
  const isOverseas = dataKey === "overseas-education";

  const [search, setSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedMainFilters, setSelectedMainFilters] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [feeRange, setFeeRange] = useState(pageInfo.feeMax);
  const [page, setPage] = useState(1);

  const perPage = 4;

  useEffect(() => {
    setSearch("");
    setSelectedCities([]);
    setSelectedLocations([]);
    setSelectedMainFilters([]);
    setRatingFilter("");
    setSortBy("popularity");
    setFeeRange(pageInfo.feeMax);
    setPage(1);
  }, [dataKey, pageInfo.feeMax]);

  const cities = useMemo(() => {
    if (isOverseas) return [];
    return [...new Set(data.map((item) => item.city).filter(Boolean))];
  }, [data, isOverseas]);

  const locations = useMemo(() => {
    if (isOverseas) return [];

    if (selectedCities.length === 0) {
      return [];
    }

    return [
      ...new Set(
        data
          .filter((item) => selectedCities.includes(item.city))
          .map((item) => item.location)
          .filter(Boolean)
      ),
    ];
  }, [data, selectedCities, isOverseas]);

  const mainFilters = useMemo(() => {
    return [...new Set(data.map((item) => item.category).filter(Boolean))];
  }, [data]);

  const toggleFilter = (value, selected, setter) => {
    const updated = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    setter(updated);
    setPage(1);
  };

  const handleCityToggle = (city) => {
    const updatedCities = selectedCities.includes(city)
      ? selectedCities.filter((item) => item !== city)
      : [...selectedCities, city];

    setSelectedCities(updatedCities);
    setSelectedLocations([]);
    setPage(1);
  };

  const filteredData = useMemo(() => {
    let result = data.filter((item) => {
      const searchText = `
        ${item.name || ""}
        ${item.city || ""}
        ${item.state || ""}
        ${item.location || ""}
        ${item.category || ""}
        ${item.description || ""}
        ${(item.tags || []).join(" ")}
      `.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesCity =
        isOverseas ||
        selectedCities.length === 0 ||
        selectedCities.includes(item.city);

      const matchesLocation =
        isOverseas ||
        selectedLocations.length === 0 ||
        selectedLocations.includes(item.location);

      const matchesMainFilter =
        selectedMainFilters.length === 0 ||
        selectedMainFilters.includes(item.category);

      const matchesRating =
        !ratingFilter || Number(item.rating || 0) >= parseFloat(ratingFilter);

      const matchesFees = Number(item.fees || 0) <= feeRange;

      return (
        matchesSearch &&
        matchesCity &&
        matchesLocation &&
        matchesMainFilter &&
        matchesRating &&
        matchesFees
      );
    });

    if (sortBy === "rating") {
      result = [...result].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    if (sortBy === "feesLow") {
      result = [...result].sort(
        (a, b) => Number(a.fees || 0) - Number(b.fees || 0)
      );
    }

    if (sortBy === "feesHigh") {
      result = [...result].sort(
        (a, b) => Number(b.fees || 0) - Number(a.fees || 0)
      );
    }

    return result;
  }, [
    data,
    search,
    selectedCities,
    selectedLocations,
    selectedMainFilters,
    ratingFilter,
    feeRange,
    sortBy,
    isOverseas,
  ]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const currentData = filteredData.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setSearch("");
    setSelectedCities([]);
    setSelectedLocations([]);
    setSelectedMainFilters([]);
    setRatingFilter("");
    setSortBy("popularity");
    setFeeRange(pageInfo.feeMax);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#ef233c]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-700">{pageInfo.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
          {/* FILTERS */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Filters</h2>

              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-[#ef233c] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold text-gray-700">Search</p>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={
                  isOverseas
                    ? "Search by consultancy or country..."
                    : "Search by name, city, area..."
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#ef233c]"
              />
            </div>

            {/* Overseas should show only countries, not city/location */}
            {isOverseas ? (
              <FilterGroup
                title="Country"
                items={mainFilters}
                selected={selectedMainFilters}
                onToggle={(item) =>
                  toggleFilter(item, selectedMainFilters, setSelectedMainFilters)
                }
              />
            ) : (
              <>
                <FilterGroup
                  title="City"
                  items={cities}
                  selected={selectedCities}
                  onToggle={handleCityToggle}
                />

                {selectedCities.length > 0 && (
                  <FilterGroup
                    title={`Area / Location in ${selectedCities.join(", ")}`}
                    items={locations}
                    selected={selectedLocations}
                    onToggle={(item) =>
                      toggleFilter(item, selectedLocations, setSelectedLocations)
                    }
                  />
                )}

                <FilterGroup
                  title={pageInfo.mainFilterTitle}
                  items={mainFilters}
                  selected={selectedMainFilters}
                  onToggle={(item) =>
                    toggleFilter(
                      item,
                      selectedMainFilters,
                      setSelectedMainFilters
                    )
                  }
                />
              </>
            )}

            {/* Fee Filter */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-bold text-gray-700">
                Fees Range
              </p>

              <input
                type="range"
                min="0"
                max={pageInfo.feeMax}
                step="1000"
                value={feeRange}
                onChange={(e) => {
                  setFeeRange(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full accent-red-500"
              />

              <div className="mt-1 flex justify-between text-[10px] text-red-500">
                <span>₹0</span>
                <span>₹{feeRange.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-bold text-gray-700">Rating</p>

              <div className="space-y-2">
                {ratings.map((item) => {
                  const value = item.split(" ")[0];

                  return (
                    <label
                      key={item}
                      className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"
                    >
                      <input
                        type="radio"
                        name={`${dataKey}-rating`}
                        checked={ratingFilter === value}
                        onChange={() => {
                          setRatingFilter(value);
                          setPage(1);
                        }}
                        className="accent-[#ef233c]"
                      />
                      ⭐ {item}
                    </label>
                  );
                })}

                {ratingFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setRatingFilter("");
                      setPage(1);
                    }}
                    className="mt-2 text-xs font-semibold text-[#ef233c]"
                  >
                    Clear rating
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* LISTINGS */}
          <main>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {pageInfo.title}
                </h1>

                <p className="text-xs text-gray-500">
                  {pageInfo.subtitle} • Showing {currentData.length} of{" "}
                  {filteredData.length} results
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 sm:w-44"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="rating">Rating</option>
                <option value="feesLow">Fees: Low to High</option>
                <option value="feesHigh">Fees: High to Low</option>
              </select>
            </div>

            {/* Active Filters */}
            {(search ||
              selectedCities.length > 0 ||
              selectedLocations.length > 0 ||
              selectedMainFilters.length > 0 ||
              ratingFilter) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {search && <ActiveChip label={`Search: ${search}`} />}

                {selectedCities.map((item) => (
                  <ActiveChip key={item} label={`City: ${item}`} />
                ))}

                {selectedLocations.map((item) => (
                  <ActiveChip key={item} label={`Area: ${item}`} />
                ))}

                {selectedMainFilters.map((item) => (
                  <ActiveChip
                    key={item}
                    label={`${isOverseas ? "Country" : pageInfo.mainFilterTitle}: ${item}`}
                  />
                ))}

                {ratingFilter && (
                  <ActiveChip label={`Rating: ${ratingFilter}+`} />
                )}
              </div>
            )}

            <div className="space-y-4">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="grid gap-4 md:grid-cols-[180px_1fr_auto]">
                    <Link to={`/category/${routeSlug}/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-36 w-full cursor-pointer rounded-lg object-cover transition hover:scale-[1.02] md:w-[180px]"
                      />
                    </Link>

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-base font-bold text-gray-900">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-xs text-gray-500">
                            {isOverseas
                              ? `${item.city}, ${item.state}`
                              : `${item.location}, ${item.city}, ${item.state}`}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-xs font-semibold text-gray-700">
                          ⭐ {item.rating}{" "}
                          <span className="text-gray-400">
                            ({item.reviews})
                          </span>
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(item.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 max-w-2xl text-xs leading-5 text-gray-600">
                        {item.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
                        <span className="font-semibold text-gray-800">
                          {isOverseas ? "Country" : pageInfo.mainFilterTitle}:{" "}
                          {item.category}
                        </span>

                        <span className="font-semibold text-gray-800">
                          Fees: ₹
                          {Number(item.fees || 0).toLocaleString("en-IN")}
                        </span>

                        {item.established && (
                          <span className="font-semibold text-gray-800">
                            Est: {item.established}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-end">
                      <Link
                        to={`/category/${routeSlug}/${item.id}`}
                        className="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:border-[#ef233c] hover:text-[#ef233c]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {currentData.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                  <h3 className="text-sm font-bold text-gray-800">
                    No results found
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">
                    Try clearing filters or checking your category data.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-md bg-[#071f4d] px-4 py-2 text-xs font-semibold text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-md border bg-white px-3 py-2 text-xs disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`h-8 w-8 rounded-md text-xs font-semibold ${
                        page === num
                          ? "bg-[#071f4d] text-white"
                          : "border bg-white text-gray-600"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-md border bg-white px-3 py-2 text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, items, selected, onToggle }) {
  return (
    <div className="mb-6 border-t border-gray-100 pt-4">
      <p className="mb-3 text-xs font-bold text-gray-700">{title}</p>

      <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
        {items.map((item) => (
          <label
            key={item}
            className="flex cursor-pointer items-center gap-2 text-xs text-gray-600"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              className="accent-[#ef233c]"
            />
            {item}
          </label>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-gray-400">No filters available</p>
        )}
      </div>
    </div>
  );
}

function ActiveChip({ label }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
      {label}
    </span>
  );
}