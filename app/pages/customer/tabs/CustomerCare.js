import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";
import gStyles from "../../../configs/gStyles";
import Comments from "./Comments";

import Activities from "./Activities";
import Tasks from "./Tasks";

const list = [
  { label: "Liên hệ", tabComponent: Activities },
  { label: "Lịch làm việc", tabComponent: Tasks },
  { label: "Bình luận", tabComponent: Comments },
];

const CustomerCare = ({ customer,isNotMe }) => {
  const [indexTabActive, setIndexTabActive] = useState(0);

  return (
    <>
      <View paddingH-16 paddingV-8 bg-surface style={gStyles.borderT}>
        <View row bg-neutral100 padding-2 br30 spread style={gStyles.border}>
          {list.map((btn, index) => {
            const isActive = index === indexTabActive;

            return (
              <Button
                key={btn.label}
                bg-transparent
                br30
                flex
                paddingH-0
                bg-white={isActive}
                style={isActive && gStyles.shadow}
                onPress={() => setIndexTabActive(index)}
              >
                <Text body2 subtitle2={isActive} primary900={isActive}>
                  {btn.label}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>

      <TabController items={list} initialIndex={indexTabActive}>
        <View flex>
          {list.map((tab, index) => (
            <TabController.TabPage
              renderLoading={() => <LoaderScreen />}
              lazy
              key={tab.label}
              index={index}
            >
              <tab.tabComponent customer={customer} isNotMe={isNotMe} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </>
  );
};

CustomerCare.propTypes = {
  customer: PropTypes.object,
};

export default CustomerCare;
