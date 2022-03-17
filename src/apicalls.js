const url = "https://akf-becp-pyapi.herokuapp.com/";
// const url = "http://localhost:5000";

export const ref_bldg_to_berdo_type = {
  SecondarySchool: "education",
  MediumOffice: "office",
  PrimarySchool: "education",
  RetailStripmall: "retail",
  QuickServiceRestaurant: "food_sales_service",
  SmallHotel: "lodging",
  MidriseApartment: "multifamily_housing",
  Warehouse: "storage",
  RetailStandalone: "retail",
  SmallOffice: "office",
  FullServiceRestaurant: "food_sales_service",
  LargeOffice: "office",
  LargeHotel: "lodging",
  Hospital: "healthcare",
  Outpatient: "healthcare",
  HighriseApartment: "multifamily_housing",
};

export const ref_bldg_to_ll97_type = {
  SecondarySchool: "E",
  MediumOffice: "B_norm",
  PrimarySchool: "E",
  RetailStripmall: "B_norm",
  QuickServiceRestaurant: "B_norm",
  SmallHotel: "R1",
  MidriseApartment: "R2",
  Warehouse: "S",
  RetailStandalone: "B_norm",
  SmallOffice: "B_norm",
  FullServiceRestaurant: "B_norm",
  LargeOffice: "B_norm",
  LargeHotel: "B_norm",
  Hospital: "B_health",
  Outpatient: "B_health",
  HighriseApartment: "R2",
};

async function getProjectionFromReferenceBuildings(alternates, callback) {
  let projection_results = [];

  async function getQueryResults(params, subdirectory) {
    let endpoint = `${url}/${subdirectory}?params=${JSON.stringify(params)}`;
    let response = await fetch(endpoint, {});
    let resjson = await response.json();
    return resjson;
  }

  for (const alt of alternates) {
    /* GET CASE INFO (REFBUILDINGS / CAMBIUM) */
    let case_results = await getQueryResults(
      alt,
      "get_projection_from_reference_buildings"
    );

    /* GET COMPLIANCE INFO */
    let berdo_types = alt["design_areas"].map((e) => {
      return {
        type: ref_bldg_to_berdo_type[e["type"]],
        area: e["area"],
      };
    });

    let ll97_types = alt["design_areas"].map((e) => {
      return {
        type: ref_bldg_to_ll97_type[e["type"]],
        area: e["area"],
      };
    });

    let { enduses_absolute_kbtu } = case_results.enduses;
    let fuels = {};
    enduses_absolute_kbtu.forEach((f) => {
      let { fuel, kbtu_absolute } = f;
      if (fuel in fuels) {
        fuels[fuel] += kbtu_absolute;
      } else {
        fuels[fuel] = 0;
      }
    });

    let compliance_utilities = [];
    Object.keys(fuels).forEach((key) => {
      let val = fuels[key];
      let fuel_name = key.toLowerCase().replace(" ", "_");
      compliance_utilities.push({
        type: fuel_name,
        val: val,
      });
    });

    let berdo_parameters = {
      types: berdo_types,
      utilities: compliance_utilities,
    };
    let ll97_parameters = {
      types: ll97_types,
      utilities: compliance_utilities,
    };

    let berdo_results = await getQueryResults(
      berdo_parameters,
      "/compliance/compile_berdo_summary"
    );
    let ll97_results = await getQueryResults(
      ll97_parameters,
      "/compliance/compile_ll97_summary"
    );

    /* COMPILE AND PUSH RESULTS */
    projection_results.push({
      name: alt.name,
      case_results,
      ll97_results,
      berdo_results,
    });
  }

  projection_results.map((d) => {
    let payment_sum = 0;
    d["berdo_results"]["acp_payments"].map((e) => {
      payment_sum += e["val"];
    });
  });
  callback(projection_results);
}

async function getQueryNoParameters(sub) {
  let endpoint = `${url}/${sub}`;
  let response = await fetch(endpoint, {});
  let resjson = await response.json();
  return resjson;
}

export { getQueryNoParameters, getProjectionFromReferenceBuildings };
