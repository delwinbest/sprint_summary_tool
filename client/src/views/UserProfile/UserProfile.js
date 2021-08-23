import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import Page1 from "./UserProfilePages/Page1.js";
import Page2 from "./UserProfilePages/Page2.js";
import Page3 from "./UserProfilePages/Page3.js";

export default function WizardView() {
  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={8}>
        <Wizard
          validate
          steps={[
            { stepName: "About", stepComponent: Page1, stepId: "about" },
            { stepName: "Account", stepComponent: Page2, stepId: "account" },
            { stepName: "Address", stepComponent: Page3, stepId: "address" },
          ]}
          title="Build Your Profile"
          subtitle="This information will let us know more about you."
          finishButtonClick={(e) => alert(e)}
        />
      </GridItem>
    </GridContainer>
  );
}
