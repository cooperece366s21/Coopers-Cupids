import React, {Component} from 'react';
import {Grid, GridItem, Text} from "@chakra-ui/react";
import {BiSitemap, FaRegComments, FaRegUserCircle, FaUsers} from "react-icons/all";

type FeatureItemProps = {iconType: string; featureText: string};
type FeatureItemState = {};

// Features on home page
class FeatureItem extends Component<FeatureItemProps,FeatureItemState> {
    render() {
        return (
            <GridItem pb={6} pt={4}>
                <Grid templateColumns="repeat(2,auto)" w={"80%"}>
                    <GridItem align="left" mr={6}>
                        {/* Chooses icon depending on input */}
                        {this.props.iconType === "profile" ?
                            <FaRegUserCircle size={80}/>
                        :this.props.iconType === "users" ?
                            <FaUsers size={80}/>
                        :this.props.iconType === "match-making" ?
                            <BiSitemap size={80}/>
                        :this.props.iconType === "messages" ?
                            <FaRegComments size={80}/>
                        : null }
                    </GridItem>
                    <GridItem align="left" pl={4} pt={4}>
                        <Text>{this.props.featureText}</Text>
                    </GridItem>
                </Grid>
            </GridItem>
        );
    }
}

export default FeatureItem;